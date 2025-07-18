"use client"

import { useEffect, useRef } from 'react'
import {
    RiCloseLine,
    RiErrorWarningLine,
    RiLoader4Line,
    RiFileCopyLine,
} from 'react-icons/ri'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { type ChatMessage, ChatRole } from '@/hooks/useCurrentChat'
import FilePreviewBar from './FilePreviewBar'
import CodeBlock from './markdown-components/CodeBlock'
import { Table } from './markdown-components/Table'

interface ChatListProps {
    messages: ChatMessage[]
    removeMessagePair: (timestamp: number) => void
    generating: boolean
    error: Error | null
}

const ChatList = ({
    messages,
    removeMessagePair,
    generating,
    error,
}: ChatListProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    // biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional, we need this for scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages]) // Add messages as a dependency

    const filteredMsgs = messages.filter((msg) => msg.role !== ChatRole.SYSTEM)

    const formatContent = (content: string) => {
        return content.replace(/(?<=\n\n)(?![*-])\n/gi, '&nbsp;\n ')
    }

    const handleCopyMessage = (content: string) => {
        window.parent.postMessage(
            {
                action: 'copy-to-clipboard',
                _payload: { content },
            },
            '*',
        )
    }

    return (
        <div
            ref={containerRef}
            className="h-[calc(100vh-200px)] text-sm overflow-y-auto pb-12 break-words"
        >
            {filteredMsgs.length < 1 ? (
                <div className="mt-10 text-center">
                    <h1 className="text-xl text-gray-500 dark:text-gray-400">
                        Bắt đầu cuộc trò chuyện 🎉
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 leading-tight font-light">
                        Nhập câu hỏi của bạn và bấm gửi
                    </p>
                </div>
            ) : (
                filteredMsgs
                    .filter((msg) => msg.role !== ChatRole.SYSTEM)
                    .map((msg, i) => (
                        <div
                            data-user={msg.role === ChatRole.USER ? 'true' : undefined}
                            className="markdown group relative px-4 py-2 data-[user]:border-l-2 border-blue-400 data-[user]:bg-black/5 data-[user]:dark:bg-neutral-900/50 max-w-[400px]"
                            key={`${msg.timestamp}-${i}`}
                        >
                            {msg.role === ChatRole.USER && (
                                <button
                                    type="button"
                                    onClick={() => removeMessagePair(msg.timestamp)}
                                    className="absolute group-hover:visible invisible right-2 top-2 p-0.5 bg-black/20 rounded"
                                >
                                    <RiCloseLine />
                                </button>
                            )}
                            {msg.role === ChatRole.ASSISTANT && (
                                <button
                                    type="button"
                                    onClick={() => handleCopyMessage(formatContent(msg.content))}
                                    className="absolute group-hover:visible invisible right-2 top-2 p-0.5 bg-black/20 rounded"
                                >
                                    <RiFileCopyLine />
                                </button>
                            )}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code: CodeBlock,
                                    table: Table,
                                }}
                            >
                                {formatContent(msg.content)}
                            </ReactMarkdown>
                            {msg.files && <FilePreviewBar files={msg.files} />}
                        </div>
                    ))
            )}
            {messages[messages.length - 1]?.role === ChatRole.USER && (
                <div className="text-neutral-500">
                    {generating && !error && (
                        <div className="animate-pulse mt-4 flex justify-center items-center gap-2">
                            <RiLoader4Line className="animate-spin" />
                            <span>Generating</span>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 flex items-center gap-4 bg-red-500/10">
                            <RiErrorWarningLine
                                className="text-red-500 flex-shrink-0"
                                size={20}
                            />
                            <span>{error.message}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChatList
