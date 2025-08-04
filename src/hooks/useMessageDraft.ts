import { useState } from 'react'

export interface MessageFile {
    id: string
    type: string
    src: string
}

export interface MessageDraft {
    text: string
}

export const useMessageDraft = () => {
    const [messageDraft, setMessageDraft] = useState<MessageDraft>({
        text: '',
    })

    const setMessageDraftText = (text: string) => {
        setMessageDraft((p) => ({ ...p, text }))
    }

    const resetMessageDraft = () => {
        setMessageDraft({
            text: '',
        })
    }

    return {
        messageDraft,
        setMessageDraftText,
        resetMessageDraft,
    }
}
