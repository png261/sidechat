import { useEffect, useRef, useState } from 'react'
import { getCurrentSiteHostName } from '../lib/getCurrentSiteHostName'
import { useChatHistory } from './useChatHistory'
import { readStorage, setStorage } from './useStorage'
import type { MessageDraft, MessageFile } from './useMessageDraft'

export enum ChatRole {
    USER = 'USER',
    ASSISTANT = 'ASSISTANT',
    SYSTEM = 'SYSTEM',
}

export type ChatMessage = {
    role: ChatRole
    content: string
    files?: MessageFile[]
    timestamp: number
}

const getStoredChatKey = (chatId: string | null) => `CHAT-${chatId}`

export const useCurrentChat = () => {
    const {
        currentChatId,
        deleteChatHistory,
        createChatHistory,
        setCurrentChatId,
        history,
        getChatHistory,
        updateChatHistory,
    } = useChatHistory()

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const messagesRef = useRef<ChatMessage[]>([])
    const currentChatIdRef = useRef<string | null>(null)
    const historyRef = useRef(history)

    messagesRef.current = messages
    currentChatIdRef.current = currentChatId
    historyRef.current = history

    const fetchStoredMessages = async () => {
        const storedChatId = await readStorage<string | null>('CURRENT_CHAT_ID')
        if (!storedChatId) {
            setMessages([])
            return
        }

        const storedMessages = await readStorage<ChatMessage[]>(getStoredChatKey(storedChatId))
        if (storedMessages) {
            setMessages(storedMessages)
        } else if (historyRef.current.length > 1) {
            setMessages([])
        }
    }

    useEffect(() => {
        fetchStoredMessages()
    }, [currentChatId])

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchStoredMessages()
            }
        }
        document.addEventListener('visibilitychange', onVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [])

    const updateAssistantMessage = (chunk: string) => {
        setMessages((msgs) => {
            if (msgs[msgs.length - 1]?.role === ChatRole.USER) {
                return [
                    ...msgs,
                    {
                        role: ChatRole.ASSISTANT,
                        content: chunk,
                        timestamp: Date.now(),
                    },
                ]
            }

            const updated = [...msgs]
            updated[updated.length - 1].content += chunk
            return updated
        })
    }

    const addNewMessage = async (role: ChatRole, message: MessageDraft) => {
        if (!currentChatIdRef.current || !historyRef.current.length) {
            const newId = createChatHistory(await getCurrentSiteHostName())
            setCurrentChatId(newId)
        }

        const chatHistory = getChatHistory(currentChatIdRef.current!)
        if (chatHistory?.name === 'New Chat') {
            const newChatName = await getCurrentSiteHostName()
            const updateChatName = (name: string) => {
                updateChatHistory(currentChatIdRef.current!, name)
                if (name.length < newChatName.length) {
                    setTimeout(() => updateChatName(newChatName.slice(0, name.length + 1)), 100)
                }
            }
            updateChatName('')
        }

        const newMessage: ChatMessage = {
            role,
            content: message.text,
            files: message.files,
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, newMessage])
    }

    const removeMessagePair = (timestamp: number) => {
        setMessages((prev) => {
            const index = prev.findIndex((msg) => msg.timestamp === timestamp)
            if (index === -1 || prev[index].role !== ChatRole.USER) return prev

            const newMessages = [...prev]
            newMessages.splice(index, 1)
            if (newMessages[index]?.role === ChatRole.ASSISTANT) {
                newMessages.splice(index, 1)
            }
            return newMessages
        })

        commitToStoredMessages()
    }

    const commitToStoredMessages = async () => {
        if (!currentChatIdRef.current) return
        await setStorage(getStoredChatKey(currentChatIdRef.current), messagesRef.current)
    }

    const clearMessages = async () => {
        if (!currentChatIdRef.current) return
        setMessages([])
        deleteChatHistory(currentChatIdRef.current)
    }

    return {
        messages: messagesRef.current,
        updateAssistantMessage,
        addNewMessage,
        commitToStoredMessages,
        clearMessages,
        currentChatId,
        removeMessagePair,
    }
}

