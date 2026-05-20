import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = { tabs: 'datalab_tabs', activeTab: 'datalab_active_tab' };
const MAX_TABS = 10;
const DEFAULT_HOME = { title: 'Главная', labNumber: null };

function loadTabState(defaultTabs) {
    try {
        const tabs      = JSON.parse(localStorage.getItem(STORAGE_KEYS.tabs));
        const activeTab = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeTab));
        if (
            Array.isArray(tabs) && tabs.length > 0 &&
            typeof tabs[0] === 'object' && tabs[0]?.title === defaultTabs[0].title
        ) {
            const validActive = Number.isInteger(activeTab) && activeTab >= 0 && activeTab < tabs.length
                ? activeTab : 0;
            return { tabs, activeTab: validActive };
        }
    } catch { /* ignore */ }
    return { tabs: defaultTabs, activeTab: 0 };
}

export function useTabs(initialTabs = [DEFAULT_HOME]) {
    const initial = loadTabState(initialTabs);
    const [tabs,      setTabs]      = useState(initial.tabs);
    const [activeTab, setActiveTab] = useState(initial.activeTab);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.tabs,      JSON.stringify(tabs));
        localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(activeTab));
    }, [tabs, activeTab]);

    const addTab = useCallback(({ title, labNumber = null }) => {
        setTabs(prev => {
            const existingIndex = prev.findIndex(t =>
                t.title === title && t.labNumber === labNumber
            );
            if (existingIndex !== -1) {
                setActiveTab(existingIndex);
                return prev;
            }
            const newTab = { title, labNumber };
            let nextTabs;
            if (prev.length >= MAX_TABS) {
                // remove oldest non-home tab when limit reached
                const removeIndex = prev.length > 1 ? 1 : 0;
                nextTabs = [...prev.slice(0, removeIndex), ...prev.slice(removeIndex + 1), newTab];
            } else {
                nextTabs = [...prev, newTab];
            }
            setActiveTab(nextTabs.length - 1);
            return nextTabs;
        });
    }, []);

    const navigateToTab = useCallback((index) => {
        setActiveTab(index);
    }, []);

    const closeTab = useCallback((indexToClose) => {
        if (indexToClose === 0) return;
        setTabs(prev => {
            if (prev.length <= 1) return prev;
            const newTabs = prev.filter((_, i) => i !== indexToClose);
            setActiveTab(current => {
                if (current === indexToClose) return Math.max(0, indexToClose - 1);
                if (current > indexToClose) return current - 1;
                return current;
            });
            return newTabs;
        });
    }, []);

    return { tabs, activeTab, addTab, navigateToTab, closeTab };
}