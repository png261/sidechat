'use client'

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { IoSend } from 'react-icons/io5'
import { HiHand } from 'react-icons/hi'
import { useChatHistory } from '@/hooks/useChatHistory'
import {
    type MessageDraft,
    useMessageDraft,
} from '@/hooks/useMessageDraft'

interface SidebarInputProps {
    loading: boolean
    submitMessage: (message: MessageDraft, context?: string) => void
    clearMessages: () => void
    chatIsEmpty: boolean
    cancelRequest: () => void
    pageText: string
}

const MAX_MESSAGE_LENGTH = 10000

export function SidebarInput({
    loading,
    submitMessage,
    cancelRequest,
    pageText
}: SidebarInputProps) {
    const {
        messageDraft,
        setMessageDraftText,
        resetMessageDraft,
    } = useMessageDraft()
    const [delayedLoading, setDelayedLoading] = useState(false)
    const { history } = useChatHistory()

    useEffect(() => {
        const handleLoadingTimeout = setTimeout(() => {
            setDelayedLoading(loading)
        }, 1000)
        return () => {
            clearTimeout(handleLoadingTimeout)
        }
    }, [loading])

    const handleSubmit = async () => {
        submitMessage(messageDraft, pageText)
        resetMessageDraft()
    }

    const sendButton = (
        <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="text-blue-500 hover:text-blue-600 disabled:bg-gray-300 "
        >
            <IoSend size={18} />
        </button>
    )

    const stopButton = (
        <button
            type="button"
            onClick={cancelRequest}
            className="text-red-500 hover:text-red-600 p-2"
        >
            <HiHand size={18} />
        </button>
    )

    return (
        <div className="p-4 bg-white">
            <div className="flex items-top gap-2 border rounded-md p-2 border-gray-200">
                <TextareaAutosize
                    minRows={2}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="Chat với gia sư AI"
                    value={messageDraft.text}
                    disabled={loading}
                    className="flex-1 resize-none rounded-md px-3 py-2 text-sm focus:outline-none disabled:bg-gray-100"
                    onChange={(e) => {
                        e.preventDefault()
                        setMessageDraftText(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                />
                <div className="flex-shrink-0">
                    {!delayedLoading ? sendButton : stopButton}
                </div>
            </div>
        </div>
    )
}

