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
                <DropdownMenu.Trigger className="flex items-center gap-1 text-neutral-500 dark:bg-neutral-900 bg-neutral-200 border rounded-md border-neutral-400/30 dark:border-neutral-500/30 py-1 px-3">
                    <RiTimeLine size={18} className="flex-shrink-0" /> Lịch sử
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    side="top"
                    className="max-w-xs mr-3 w-[280px] dark:bg-neutral-900 bg-neutral-200 border border-neutral-400/30 dark:border-neutral-500/30 rounded-lg mb-1.5 pb-3 overflow-hidden focus:outline-none"
                >
                    <div>
                        <div className="flex justify-between items-center p-3 border-b-[#E5E7EB] border-b dark:border-b-[#2F2F2F]">
                            <h1 className="text-lg font-bold text-[#5A5A5A] dark:text-[#E3E3E3]">
                                Lịch sử
                            </h1>
                            <button
                                type="button"
                                className="flex items-center text-white bg-[#3B82F6] gap-1.5 px-2.5 py-1.5 rounded-md font-medium"
                                onClick={handleCreateNewChat}
                            >
                                <RiAddLine />
                                Tạo mới
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {history.map((chat, i) => (
                                <DropdownMenu.Item
                                    key={chat.id}
                                    onSelect={() => {
                                        setCurrentChatId(chat.id)
                                    }}
                                    className={`px-3 py-1.5 focus:outline-none focus-visible:bg-black/20 relative flex gap-3 justify-between items-center border-b dark:border-b-[#2F2F2F] ${i === history.length - 1
                                            ? 'border-b-0'
                                            : 'border-b-[#E5E7EB]'
                                        } cursor-pointer`}
                                >
                                    <div className="flex gap-2 justify-center items-center">
                                        <div
                                            className="absolute left-0 h-full w-[3px] data-[current-chat]:bg-[#70A3F3]"
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
                                            <RiCloseCircleFill
                                                size={14}
                                                className="text-gray-500"
                                            />
                                        </button>
                                        <div className="flex justify-between items-center gap-2">
                                            <span
                                                title={chat.name}
                                                className="text-sm truncate max-w-[160px] dark:text-neutral-300 text-neutral-600"
                                            >
                                                {chat.name}
                                            </span>
                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
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
