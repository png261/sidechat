"use client"

import React, { useEffect } from 'react'
import ChatList from './ChatList'
import { SidebarInput } from './ChatInput'
import { useChatCompletion } from '@/hooks/useChatCompletion'
import { SYSTEM_PROMPT } from '@/config/prompts'
import type { Settings } from '@/config/settings'

interface ChatProps {
    settings: Settings
    pageText: string
}

const Chat = ({ settings, pageText }: ChatProps) => {
    const {
        messages,
        submitQuery,
        clearMessages,
        generating,
        cancelRequest,
        removeMessagePair,
        error,
    } = useChatCompletion({
        model: settings.chat.model!,
        apiKey: settings.chat.apiKey!,
        apiUrl: settings.chat.apiUrl,
        systemPrompt: SYSTEM_PROMPT,
    })

    useEffect(() => {
        const handleWindowMessage = (event: MessageEvent) => {
            const { action, prompt } = event.data as {
                action: string
                prompt: string
            }
            if (action === 'generate') {
                submitQuery({ text: prompt, files: [] })
            }
        }
        window.addEventListener('message', handleWindowMessage)

        return () => {
            window.removeEventListener('message', handleWindowMessage)
        }
    }, [submitQuery])

    return (
        <>
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
                isWebpageContextOn={settings.general.webpageContext}
                pageText={pageText}
                isVisionModel={true}
            />
        </>
    )
}

export default Chat
