'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import './style.css'
import type { Settings } from '@/config/settings'

export interface SideChatProps {
    children: React.ReactNode
    settings: Settings
}

export const SideChat = ({ children, settings }: SideChatProps) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const [pageText, setPageText] = useState<string>('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        if (contentRef.current) {
            const text = contentRef.current.innerText || ''
            setPageText(text)
        }
    }, [children])

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    return (
        <div className="chat-agent-wrapper">
            <div className="chat-agent-content" ref={contentRef}>
                {children}
            </div>

            {!isSidebarOpen && (
                <button
                    className="sidebar-open-button"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    ☰
                </button>
            )}

            {isSidebarOpen && (
                <Sidebar settings={settings} pageText={pageText} toggleSidebar={toggleSidebar} />
            )}
        </div>
    )
}

