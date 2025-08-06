'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import type { Settings } from '@/config/settings'
import { RiRobot2Line } from 'react-icons/ri'

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
        <div>
            <div ref={contentRef} className="p-4">
                {children}
            </div>

            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                    className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition duration-200"
                >
                    <RiRobot2Line className="w-6 h-6" />
                </button>
            )}

            {isSidebarOpen && (
                <div className="fixed top-0 right-0 h-full w-100 bg-white shadow-lg z-50 transition duration-300">
                    <Sidebar
                        settings={settings}
                        pageText={pageText}
                        toggleSidebar={toggleSidebar}
                    />
                </div>
            )}
        </div>
    )
}

