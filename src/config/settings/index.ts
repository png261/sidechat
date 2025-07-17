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
        openAIKey: string | null
        model: string | null
        mode: Mode
        openAiBaseUrl: string | null
    }
    general: {
        theme: ThemeOptions
        webpageContext: boolean
    }
}

export const defaultSettings: Settings = {
    chat: {
        openAIKey: null,
        model: null,
        mode: Mode.BALANCED,
        openAiBaseUrl: null,
    },
    general: {
        theme: ThemeOptions.SYSTEM,
        webpageContext: false,
    },
}
