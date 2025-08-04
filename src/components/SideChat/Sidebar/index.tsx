"use client"

import React, { useEffect } from 'react'
import ChatList from './ChatList'
import { SidebarInput } from './ChatInput'
import { useChatCompletion } from '@/hooks/useChatCompletion'
import { SYSTEM_PROMPT } from '@/config/prompts'
import type { Settings } from '@/config/settings'
import "./style.css"

interface ChatProps {
    settings: Settings
    pageText: string
    toggleSidebar: any
}

const Sidebar = ({ settings, pageText, toggleSidebar }: ChatProps) => {
    const {
        messages,
        submitQuery,
        clearMessages,
        generating,
        cancelRequest,
        removeMessagePair,
        error,
    } = useChatCompletion({
        model: settings.model!,
        apiKey: settings.apiKey!,
        apiUrl: settings.apiUrl,
        systemPrompt: SYSTEM_PROMPT,
    })

    useEffect(() => {
        const handleWindowMessage = (event: MessageEvent) => {
            const { action, prompt } = event.data as {
                action: string
                prompt: string
            }
            if (action === 'generate') {
                submitQuery({ text: prompt })
            }
        }
        window.addEventListener('message', handleWindowMessage)

        return () => {
            window.removeEventListener('message', handleWindowMessage)
        }
    }, [submitQuery])

    return (
        <div className="sidebar">
            <button
                className="sidebar-close-button"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
                X
            </button>
            <ChatList
                messages={messages}
                removeMessagePair={removeMessagePair}
                generating={generating}
                error={error}
            />
            <SidebarInput
                loading={generating}
                submitMessage={submitQuery}
                chatIsEmpty={messages.length <= 1}
                clearMessages={clearMessages}
                cancelRequest={cancelRequest}
                pageText={pageText}
                isVisionModel={true}
            />
        </div>
    )
}

export default Sidebar
