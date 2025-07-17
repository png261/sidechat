import { useCallback } from 'react'
import { getUUID } from '../lib/getUUID'
import { useStorage, setStorage } from './useStorage'

interface ChatHistory {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

/**
 * Replaces Jotai atom version using localStorage
 */
export const useChatHistory = () => {
    const [history, setHistory] = useStorage<ChatHistory[]>('HISTORY', [])
    const [currentChatId, setCurrentChatId] = useStorage<string | null>('CURRENT_CHAT_ID', null)

    const createChatHistory = useCallback((name: string, newId = getUUID()) => {
        const newChat: ChatHistory = {
            id: newId,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        setHistory((prev) => [...prev, newChat])
        setCurrentChatId(newId)

        return newId
    }, [setHistory, setCurrentChatId])

    const deleteChatHistory = useCallback(async (id: string | null) => {
        if (!id) return

        // Remove associated messages from storage
        localStorage.removeItem(`CHAT-${id}`)

        setHistory((prev) => {
            const updated = prev.filter((h) => h.id !== id)
            const newCurrent = updated[0]?.id ?? null
            setCurrentChatId(newCurrent)
            return updated
        })
    }, [setHistory, setCurrentChatId])

    const getChatHistory = useCallback((id: string) => {
        return history.find((h) => h.id === id)
    }, [history])

    const updateChatHistory = useCallback((id: string, name: string) => {
        setHistory((prev) =>
            prev.map((h) => h.id === id
                ? { ...h, name, updatedAt: new Date().toISOString() }
                : h)
        )
    }, [setHistory])

    return {
        currentChatId,
        setCurrentChatId,
        createChatHistory,
        deleteChatHistory,
        getChatHistory,
        updateChatHistory,
        history,
    }
}

