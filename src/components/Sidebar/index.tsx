'use client'
import Chat from './chat'
import type { Settings } from '@/config/settings'
import './style.css' // Make sure to import the CSS file

interface Props {
    settings: Settings
    pageText: string
}

export function Sidebar({ settings, pageText }: Props) {
    return (
        <div className="sidebar">
            <Chat settings={settings} pageText={pageText} />
        </div>
    )
}

