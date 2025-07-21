'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Sidebar } from '../Sidebar'
import type { Settings } from '@/config/settings'

export interface ChatAgentProps {
    children: React.ReactNode
    settings: Settings
}

export const ChatAgent = ({ children, settings }: ChatAgentProps) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const [pageText, setPageText] = useState<string>('')

    useEffect(() => {
        if (contentRef.current) {
            const text = contentRef.current.innerText || ''
            setPageText(text)
        }
    }, [children])

    return (
        <div className="chat-agent-wrapper p-4 rounded-xl shadow bg-white dark:bg-neutral-900 flex">
            <Sidebar settings={settings} pageText={pageText} />
            <div className="chat-agent-content flex-1 p-4" ref={contentRef}>
                {children}
            </div>
        </div>
    )
}

