"use client";

import type { Settings } from '@/config/settings'

import React, { createContext, useContext, ReactNode } from 'react';

const SettingsContext = createContext<Settings | undefined>(undefined);

type SettingsProviderProps = {
    settings: Settings;
    children: ReactNode;
};

export const SideChatProvider = ({ settings, children }: SettingsProviderProps) => {
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): Settings => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

