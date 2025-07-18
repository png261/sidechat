'use client'
import Chat from './chat'
import type { Settings } from '@/config/settings'

interface Props {
    settings: Settings
    pageText: string
}

export function Sidebar({ settings, pageText }: Props) {
    return (
        <div className="flex backdrop-blur-sm flex-col min-h-screen shadow-md border-l dark:!text-white dark:border-neutral-800 border-neutral-200 top-0 right-0 w-[400px] h-full dark:bg-neutral-800/90 bg-neutral-100/90">
            <Chat settings={settings} pageText={pageText} />
        </div>
    )
}

