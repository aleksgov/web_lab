import { useState, useCallback } from 'react';

export function useTabs(initialTabs = ['Главная']) {
    const [tabs, setTabs] = useState(initialTabs);
    const [activeTab, setActiveTab] = useState(0);

    const addTab = useCallback((title) => {
        setTabs(prev => {
            const existingIndex = prev.findIndex(t => t === title);
            if (existingIndex !== -1) {
                setActiveTab(existingIndex);
                return prev;
            }
            setActiveTab(prev.length);
            return [...prev, title];
        });
    }, []);

    const navigateToTab = useCallback((index) => {
        setTabs(prev => prev.slice(0, index + 1));
        setActiveTab(index);
    }, []);

    return { tabs, activeTab, addTab, navigateToTab };
}