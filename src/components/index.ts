'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Sidebar } from '../Sidebar'
import './style.css'
import type { Settings } from '@/config/settings'

export interface ChatAgentProps {
    children: React.ReactNode
    settings: Settings
}

export const ChatAgent = ({ children, settings }: ChatAgentProps) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const [pageText, setPageText] = useState<string>('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        if (contentRef.current) {
            const text = contentRef.current.innerText || ''
            setPageText(text)
        }
    }, [children])

    return (
        <div className= "chat-agent-wrapper" >
        <div className="chat-agent-content" ref = { contentRef } >
            { children }
            </div>

            < button
    className = "sidebar-toggle-button"
    onClick = {() => setIsSidebarOpen(prev => !prev)}
aria - label="Toggle Sidebar"
    >
                ☰
</button>

{
    isSidebarOpen && (
        <Sidebar settings={ settings } pageText = { pageText } />
            )
}
</div>
    )
}


