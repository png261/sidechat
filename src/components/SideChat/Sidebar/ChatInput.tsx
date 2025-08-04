"use client"

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { GiMagicBroom } from 'react-icons/gi'
import { IoSend } from 'react-icons/io5'
import { HiHand } from 'react-icons/hi'
import ChatHistory from './ChatHistory'
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
    isVisionModel: boolean
    pageText: string
}

const MAX_MESSAGE_LENGTH = 10000

export function SidebarInput({
    loading,
    submitMessage,
    clearMessages,
    chatIsEmpty,
    cancelRequest,
    isVisionModel,
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
            className="send-button"
        >
            <span>Gửi</span> <IoSend size={10} />
        </button>
    )

    const stopButton = (
        <button
            type="button"
            onClick={cancelRequest}
            className="stop-button"
        >
            <HiHand size={18} /> <span>Dừng</span>
        </button>
    )

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                {!chatIsEmpty ? (
                    <button
                        type="button"
                        onClick={clearMessages}
                        className="clear-button"
                    >
                        <GiMagicBroom size={16} />
                    </button>
                ) : (
                    <div />
                )}
                <div className="chat-history">
                    {(history.length || !chatIsEmpty) && <ChatHistory />}
                </div>
            </div>

            <div className="input-container">
                <TextareaAutosize
                    minRows={2}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="Nhập câu hỏi của bạn ở đây..."
                    value={messageDraft.text}
                    disabled={loading}
                    className="input-textarea"
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
                <div className="input-actions">
                    {!delayedLoading ? sendButton : stopButton}
                </div>
            </div>
        </div>
    )
}

