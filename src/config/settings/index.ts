import { defaultPrompts } from '../prompts/default'

export enum ThemeOptions {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system',
}

export enum Mode {
    HIGHLY_PRECISE = 0,
    PRECISE = 0.5,
    BALANCED = 1,
    CREATIVE = 1.5,
}

export type Settings = {
    chat: {
        apiKey: string
        apiUrl: string
        model: string
    }
    general: {
        theme: ThemeOptions
        webpageContext: boolean
    }
}
