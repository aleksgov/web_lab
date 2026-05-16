import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = { tabs: 'datalab_tabs', activeTab: 'datalab_active_tab' };

function loadTabState(defaultTabs) {
    try {
        const tabs      = JSON.parse(localStorage.getItem(STORAGE_KEYS.tabs));
        const activeTab = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeTab));
        if (Array.isArray(tabs) && tabs.length > 0 && tabs[0] === defaultTabs[0]) {
            const validActive = Number.isInteger(activeTab) && activeTab >= 0 && activeTab < tabs.length
                ? activeTab : 0;
            return { tabs, activeTab: validActive };
        }
    } catch { /* ignore */ }
    return { tabs: defaultTabs, activeTab: 0 };
}

export function useTabs(initialTabs = ['Главная']) {
    const initial = loadTabState(initialTabs);
    const [tabs,      setTabs]      = useState(initial.tabs);
    const [activeTab, setActiveTab] = useState(initial.activeTab);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.tabs,      JSON.stringify(tabs));
        localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(activeTab));
    }, [tabs, activeTab]);

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