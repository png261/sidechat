'use client'

import { useEffect, useRef } from 'react'
import {
    RiErrorWarningLine,
    RiLoader4Line,
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
import {
    type MessageDraft,
    useMessageDraft,
} from '@/hooks/useMessageDraft'

interface ChatListProps {
    messages: ChatMessage[]
    generating: boolean
    error: Error | null
    submitMessage: (message: MessageDraft, context?: string) => void
    pageText: string
}

const ChatList = ({
    messages,
    generating,
    error,
    submitMessage,
    pageText
}: ChatListProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        console.log({ messages })
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

    // Suggested prompts for an empty chat
    const suggestedPrompts = [
        'Tóm tắt nội dung chính của văn bản này.',
        'Giải thích các khái niệm quan trọng trong bài này.',
        'Đưa ra một số câu hỏi trắc nghiệm về nội dung này.',
        'Phân tích những điểm quan trọng nhất của văn bản.'
    ]

    const handleSubmit = async (prompt: string) => {
        const newMessage: MessageDraft = {
            text: prompt,
        }
        submitMessage(newMessage, pageText)
    }

    return (
        <div
            ref={containerRef}
            className="flex flex-col overflow-y-auto h-[calc(100vh-10rem)] p-4"
        >
            {filteredMsgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Xin chào! Tôi có thể giúp gì cho bạn?
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Bạn có thể bắt đầu bằng cách chọn một trong các gợi ý dưới đây.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                        {suggestedPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleSubmit(prompt)}
                                className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-lg shadow-md text-left text-sm text-gray-800"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                // Display chat messages when available
                <div className="flex flex-col space-y-7">
                    {messages.map((msg, i) => {
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
                </div>
            )}

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
