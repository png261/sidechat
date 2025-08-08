'use client'

import { useState } from 'react'
import ChatList from './ChatList'
import { SidebarInput } from './ChatInput'
import { useChatCompletion } from '@/hooks/useChatCompletion'
import { useSettings } from '@/provider';


interface ChatProps {
    model: string
    pageText: string
    toggleSidebar: () => void;
}

const Sidebar = ({ model, pageText, toggleSidebar }: ChatProps) => {
    const [isFullScreen, setIsFullScreen] = useState(false)
    const settings = useSettings()

    const {
        messages,
        submitQuery,
        clearMessages,
        generating,
        cancelRequest,
        error,
    } = useChatCompletion({
        model: model!,
        apiKey: settings.apiKey!,
        apiUrl: settings.apiUrl,
    })

    const handleToggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    return (
        <div className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-all duration-300 flex flex-col border-l border-gray-200 ${isFullScreen ? 'w-full' : 'w-100'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Gia sư AI</h2>
                <div className="flex items-center space-x-2">
                    <button
                        className="text-gray-500 hover:text-gray-900 transition"
                        onClick={handleToggleFullScreen}
                        aria-label={isFullScreen ? 'Collapse Sidebar' : 'Expand Full Screen'}
                    >
                        <span className="sidebar-expand">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {isFullScreen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                                )}
                            </svg>
                        </span>
                    </button>
                    <button
                        className="text-xl font-bold transition"
                        onClick={toggleSidebar}
                        aria-label="Close Sidebar"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Chat List */}
            <ChatList
                messages={messages}
                generating={generating}
                error={error}
                submitMessage={submitQuery}
                pageText={pageText}
            />

            {/* Input Section */}
            <SidebarInput
                loading={generating}
                submitMessage={submitQuery}
                chatIsEmpty={messages.length <= 1}
                clearMessages={clearMessages}
                cancelRequest={cancelRequest}
                pageText={pageText}
            />
        </div>
    )
}

export default Sidebar
