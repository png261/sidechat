'use client'

import { useEffect, useRef } from 'react'
import {
    RiCloseLine,
    RiErrorWarningLine,
    RiLoader4Line,
    RiFileCopyLine,
    RiRobot2Line,
    RiUser3Line
} from 'react-icons/ri'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { type ChatMessage, ChatRole } from '@/hooks/useCurrentChat'
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
    generating,
    error,
    removeMessagePair
}: ChatListProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

    const filteredMsgs = messages.filter((msg) => msg.role !== ChatRole.SYSTEM)

    const formatContent = (content: string) => {
        return content.replace(/(?<=\n\n)(?![*-])\n/gi, '&nbsp;\n ')
    }

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    return (
        <div
            ref={containerRef}
            className="flex flex-col space-y-7 overflow-y-auto h-[calc(100vh-10rem)] p-4"
        >
            {filteredMsgs.map((msg, i) => {
                const isUser = msg.role === ChatRole.USER
                return (
                    <div
                        key={`${msg.timestamp}-${i}`}
                        className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        {!isUser && (
                            <div className="flex-shrink-0 text-blue-500">
                                <RiRobot2Line size={24} />
                            </div>
                        )}

                        <div
                            className={`relative max-w-[75%] rounded-lg px-4 py-3 text-sm shadow-md whitespace-pre-wrap ${isUser
                                    ? 'bg-blue-500 text-white self-end'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                        >
                            <span className="absolute -top-4 text-xs text-gray-400 right-0">
                                {formatTimestamp(msg.timestamp)}
                            </span>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                components={{ code: CodeBlock, table: Table }}
                            >
                                {formatContent(msg.content)}
                            </ReactMarkdown>
                        </div>

                        {isUser && (
                            <div className="flex-shrink-0 text-blue-500">
                                <RiUser3Line size={20} />
                            </div>
                        )}
                    </div>
                )
            })}

            {messages[messages.length - 1]?.role === ChatRole.USER && (
                <div className="mt-4">
                    {generating && !error && (
                        <div className="flex items-center gap-2 text-gray-600 animate-pulse">
                            <RiLoader4Line className="animate-spin" size={20} />
                            <span>Gia sư đang phản hồi...</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600">
                            <RiErrorWarningLine size={20} />
                            <span>{error.message}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChatList

