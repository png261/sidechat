"use client"

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { GiMagicBroom } from 'react-icons/gi'
import { IoSend } from 'react-icons/io5'
import { HiHand } from 'react-icons/hi'
import ChatHistory from './ChatHistory'
import { useChatHistory } from '@/hooks/useChatHistory'
import WebPageContentToggle from './WebPageContentToggle'
import ImageCaptureButton from './ImageCaptureButton'
import {
    type MessageDraft,
    useMessageDraft,
} from '@/hooks/useMessageDraft'
import FilePreviewBar from './FilePreviewBar'

interface SidebarInputProps {
    loading: boolean
    submitMessage: (message: MessageDraft, context?: string) => void
    clearMessages: () => void
    chatIsEmpty: boolean
    cancelRequest: () => void
    isWebpageContextOn: boolean
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
    isWebpageContextOn,
    isVisionModel,
    pageText
}: SidebarInputProps) {
    const {
        messageDraft,
        setMessageDraftText,
        resetMessageDraft,
        addMessageDraftFile,
        removeMessageDraftFile,
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
        let context: string | undefined

        if (isWebpageContextOn) {
            context = pageText
        }

        submitMessage(messageDraft, context)
        resetMessageDraft()
    }


    const sendButton = (
        <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="flex gap-2 disabled:bg-slate-500 disabled:text-slate-400 items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
            <span>Gửi</span> <IoSend size={10} />
        </button>
    )

    const stopButton = (
        <button
            type="button"
            onClick={cancelRequest}
            className="flex gap-2 disabled:bg-slate-500 disabled:text-slate-400 items-center bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
            <HiHand size={18} /> <span>Dừng</span>
        </button>
    )

    return (
        <div className="fixed bottom-0 left-0 right-0 flex flex-col">
            <div className="flex mx-3 items-center justify-between">
                {!chatIsEmpty ? (
                    <button
                        type="button"
                        onClick={clearMessages}
                        className="rounded-full h-8 w-8 grid place-items-center text-center bg-blue-500 hover:bg-blue-700 text-white"
                    >
                        <GiMagicBroom size={16} className="mx-auto" />
                    </button>
                ) : (
                    <div />
                )}
                <div className="flex gap-2">
                    {(history.length || !chatIsEmpty) && <ChatHistory />}
                </div>
            </div>

            <div className="m-2 rounded-md border dark:border-neutral-800 border-neutral-300 dark:bg-neutral-900/90 bg-neutral-200/90 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50">
                {messageDraft.files.length > 0 && (
                    <FilePreviewBar
                        files={messageDraft.files}
                        removeFile={removeMessageDraftFile}
                    />
                )}
                <TextareaAutosize
                    minRows={2}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="Nhập câu hỏi của bạn ở đây..."
                    value={messageDraft.text}
                    disabled={loading}
                    className="p-3 w-full focus:!outline-none placeholder:text-neutral-500 text-sm resize-none max-h-96 pb-0 bg-transparent !border-none"
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
                <div className="flex justify-between items-center p-3">
                    <div className="flex gap-2">
                        {isVisionModel && (
                            <ImageCaptureButton addMessageDraftFile={addMessageDraftFile} />
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <WebPageContentToggle />
                        {!delayedLoading ? sendButton : stopButton}
                    </div>
                </div>
            </div>
        </div>
    )
}

