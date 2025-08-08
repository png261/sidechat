import type { Settings } from '@/config/settings'

import React, { createContext, useContext, ReactNode } from 'react';

const SideChatContext = createContext<Settings | undefined>(undefined);

type Props = {
    settings: Settings;
    children: ReactNode;
};

export const SideChatProvider = ({ settings, children }: Props) => {
    return (
        <SideChatContext.Provider value={settings}>
            {children}
        </SideChatContext.Provider>
    );
};

export const useSettings = (): Settings => {
    const context = useContext(SideChatContext);
    if (!context) {
        throw new Error('useSettings must be used within a SideChatProvider');
    }
    return context;
};

