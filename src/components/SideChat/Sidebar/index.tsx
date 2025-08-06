'use client'

import React, { useEffect } from 'react'
import ChatList from './ChatList'
import { SidebarInput } from './ChatInput'
import { useChatCompletion } from '@/hooks/useChatCompletion'
import type { Settings } from '@/config/settings'

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
        <div className="flex justify-between flex-col h-full border-l border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Gia sư AI</h2>
                <button
                    className="text-xl font-bold transition"
                    onClick={toggleSidebar}
                    aria-label="Close Sidebar"
                >
                    ✕
                </button>
            </div>

            {/* Chat List */}
            <ChatList
                messages={messages}
                removeMessagePair={removeMessagePair}
                generating={generating}
                error={error}
            />

            {/* Input Section */}
            <SidebarInput
                loading={generating}
                submitMessage={submitQuery}
                chatIsEmpty={messages.length <= 1}
                clearMessages={clearMessages}
                cancelRequest={cancelRequest}
                pageText={pageText}
            />
        </div>
    )
}

export default Sidebar

