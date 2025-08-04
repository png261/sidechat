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

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

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
        <div ref={containerRef} className="chat-list-container">
            {filteredMsgs.length < 1 ? (
                <div className="chat-empty">
                    <h1 className="chat-empty-title">Bắt đầu cuộc trò chuyện 🎉</h1>
                    <p className="chat-empty-subtext">
                        Nhập câu hỏi của bạn và bấm gửi
                    </p>
                </div>
            ) : (
                filteredMsgs.map((msg, i) => (
                    <div
                        key={`${msg.timestamp}-${i}`}
                        className={`chat-message ${msg.role === ChatRole.USER ? 'user-message' : ''}`}
                        data-user={msg.role === ChatRole.USER ? 'true' : undefined}
                    >
                        {msg.role === ChatRole.USER && (
                            <button
                                type="button"
                                onClick={() => removeMessagePair(msg.timestamp)}
                                className="chat-btn chat-remove-btn"
                            >
                                <RiCloseLine />
                            </button>
                        )}
                        {msg.role === ChatRole.ASSISTANT && (
                            <button
                                type="button"
                                onClick={() => handleCopyMessage(formatContent(msg.content))}
                                className="chat-btn chat-copy-btn"
                            >
                                <RiFileCopyLine />
                            </button>
                        )}
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                            components={{ code: CodeBlock, table: Table }}
                        >
                            {formatContent(msg.content)}
                        </ReactMarkdown>
                    </div>
                ))
            )}
            {messages[messages.length - 1]?.role === ChatRole.USER && (
                <div className="chat-footer">
                    {generating && !error && (
                        <div className="chat-generating">
                            <RiLoader4Line className="chat-generating-icon" />
                            <span>Generating</span>
                        </div>
                    )}
                    {error && (
                        <div className="chat-error">
                            <RiErrorWarningLine className="chat-error-icon" size={20} />
                            <span>{error.message}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChatList
