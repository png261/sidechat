"use client"

import { useChatHistory } from '@/hooks/useChatHistory'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { RiAddLine, RiCloseCircleFill, RiTimeLine } from 'react-icons/ri'
import { generateReadableRelativeDate } from '@/lib/generateReadableDate'

const ChatHistory = () => {
    const {
        history,
        setCurrentChatId,
        currentChatId,
        getChatHistory,
        createChatHistory,
        deleteChatHistory,
    } = useChatHistory()

    if (!currentChatId) return null

    const currentChat = getChatHistory(currentChatId)

    const handleCreateNewChat = async () => {
        const newId = createChatHistory('New Chat')
        setCurrentChatId(newId)
    }

    const handleChatDelete = (id: string) => {
        deleteChatHistory(id)
    }

    return (
        <div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="chat-trigger">
                    <RiTimeLine size={18} className="icon" /> Lịch sử
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="top" className="chat-dropdown">
                    <div>
                        <div className="chat-header">
                            <h1 className="chat-header-title">Lịch sử</h1>
                            <button
                                type="button"
                                className="chat-new-btn"
                                onClick={handleCreateNewChat}
                            >
                                <RiAddLine />
                                Tạo mới
                            </button>
                        </div>
                        <div className="chat-history-list">
                            {history.map((chat, i) => (
                                <DropdownMenu.Item
                                    key={chat.id}
                                    onSelect={() => {
                                        setCurrentChatId(chat.id)
                                    }}
                                    className={`chat-item ${i === history.length - 1 ? 'no-border' : ''}`}
                                >
                                    <div className="chat-item-content">
                                        <div
                                            className="chat-active-indicator"
                                            data-current-chat={
                                                currentChat?.id === chat.id || undefined
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleChatDelete(chat.id)
                                            }}
                                        >
                                            <RiCloseCircleFill size={14} className="chat-delete-icon" />
                                        </button>
                                        <div className="chat-name-group">
                                            <span
                                                title={chat.name}
                                                className="chat-name"
                                            >
                                                {chat.name}
                                            </span>
                                            <span className="chat-date">
                                                {generateReadableRelativeDate(chat.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenu.Item>
                            ))}
                        </div>
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    )
}

export default ChatHistory
