import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

export type StorageArea = 'local' | 'indexedDB'

type SetValue<T> = Dispatch<SetStateAction<T>>

export function useStorage<T>(
    key: string,
    defaultValue: T,
    area: StorageArea = 'local',
): [T, SetValue<T>] {
    const [storedValue, setStoredValue] = useState<T>(defaultValue)

    useEffect(() => {
        readStorage<T>(key, area).then((res) => {
            if (res !== undefined) {
                setStoredValue(res)
            }
        })

        // Optional: sync between tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === key && e.storageArea === localStorage && area === 'local') {
                if (e.newValue) {
                    setStoredValue(JSON.parse(e.newValue))
                }
            }
        }
        if (area === 'local') {
            window.addEventListener('storage', handleStorage)
            return () => window.removeEventListener('storage', handleStorage)
        }
    }, [key, area])

    const setValueRef = useRef<SetValue<T>>()

    setValueRef.current = (value) => {
        const newValue = value instanceof Function ? value(storedValue) : value
        setStoredValue((prev) => {
            setStorage(key, newValue, area).catch(() => {
                setStoredValue(prev) // rollback
            })
            return newValue
        })
    }

    const setValue: SetValue<T> = useCallback(
        (value) => setValueRef.current?.(value),
        [],
    )

    return [storedValue, setValue]
}

// Read value from localStorage or indexedDB
export async function readStorage<T>(
    key: string,
    area: StorageArea = 'local',
): Promise<T | undefined> {
    try {
        if (area === 'indexedDB') {
            return getFromIndexedDB<T>(key)
        } else {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : undefined
        }
    } catch (e) {
        console.warn(`Failed to read from ${area} storage`, e)
        return undefined
    }
}

// Write value to localStorage or indexedDB
export async function setStorage<T>(
    key: string,
    value: T,
    area: StorageArea = 'local',
): Promise<boolean> {
    try {
        if (area === 'indexedDB') {
            await saveToIndexedDB<T>(key, value)
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
        return true
    } catch (e) {
        console.warn(`Failed to write to ${area} storage`, e)
        return false
    }
}

// --- IndexedDB Helpers ---
export const saveToIndexedDB = async <T>(
    key: string,
    data: T,
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('AppDB', 1)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains('storage')) {
                db.createObjectStore('storage')
            }
        }

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            const tx = db.transaction('storage', 'readwrite')
            const store = tx.objectStore('storage')
            store.put(data, key)

            tx.oncomplete = () => resolve()
            tx.onerror = () => reject(tx.error)
        }

        request.onerror = () => reject(request.error)
    })
}

export const getFromIndexedDB = async <T>(key: string): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve, reject) => {
        const request = indexedDB.open('AppDB', 1)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains('storage')) {
                db.createObjectStore('storage')
            }
        }

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            const tx = db.transaction('storage', 'readonly')
            const store = tx.objectStore('storage')
            const getReq = store.get(key)

            getReq.onsuccess = () => resolve(getReq.result)
            getReq.onerror = () => reject(getReq.error)
        }

        request.onerror = () => reject(request.error)
    })
}

