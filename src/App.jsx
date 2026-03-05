import React, { useState, useRef, useEffect, useMemo } from 'react';
import './styles/App.css';

import { LAB_CONFIG } from './config/labs.config';
import { COLOR_THEMES, DEFAULT_THEME_INDEX } from './config/theme.config';
import { useTabs } from './hooks/useTabs';
import { useLabContent } from './hooks/useLabContent';

import ColorPicker from './components/ui/ColorPicker';
import InfoModal from './components/ui/InfoModal';
import TabNavigation from './components/layout/TabNavigation';
import Accordion from './components/ui/Accordion';
import MainTab from './components/tabs/MainTab';
import LabWorkTab from './components/tabs/LabWorkTab';
import TheoryTab from './components/tabs/TheoryTab';
import VariantsTab from './components/tabs/VariantsTab';
import TaskTab from './components/tabs/TaskTab';

function App() {
    const [themeIndex, setThemeIndex]         = useState(DEFAULT_THEME_INDEX);
    const [showNotification, setShowNotification] = useState(false);
    const [activeVariant, setActiveVariant]   = useState(1);
    const taskContentRef = useRef(null);

    const { tabs, activeTab, addTab, navigateToTab } = useTabs();

    const currentTab = tabs[activeTab] ?? '';

    const labNumber = useMemo(() => {
        for (let i = activeTab; i >= 0; i--) {
            const match = tabs[i]?.match(/Лабораторная работа №\s*(\d+)/);
            if (match) return match[1];
        }
        return null;
    }, [tabs, activeTab]);

    const { theoryContent, taskContent } = useLabContent(labNumber);

    const variantsCount = LAB_CONFIG[labNumber]?.tasks?.count ?? 30;

    useEffect(() => {
        if (currentTab !== 'Теория') { setShowNotification(false); return; }
        setShowNotification(true);
        const t = setTimeout(() => setShowNotification(false), 2000);
        return () => clearTimeout(t);
    }, [currentTab]);

    useEffect(() => {
        if (!taskContentRef.current || !activeVariant) return;
        taskContentRef.current.querySelectorAll('.variant').forEach(v => v.classList.remove('active'));
        taskContentRef.current.querySelector(`#variant-${activeVariant}`)?.classList.add('active');
    }, [activeVariant, taskContent]);

    const openTheory  = () => addTab('Теория');
    const openExample = () => addTab('Пример');
    const openTasks   = () => addTab(LAB_CONFIG[labNumber]?.tasks?.count ? 'Задания' : 'Задание');
    const openVariant = (index) => {
        const n = index + 1;
        setActiveVariant(n);
        addTab(`Вариант №${n}`);
    };
    const openLab = (number) => addTab(`Лабораторная работа №${number}`);

    const renderContent = () => {
        if (activeTab === 0) {
            return <MainTab onLabClick={openLab} />;
        }

        if (currentTab.startsWith('Лабораторная работа')) {
            return (
                <LabWorkTab
                    currentTab={currentTab}
                    onTheoryClick={openTheory}
                    onExampleClick={openExample}
                    onTasksClick={openTasks}
                />
            );
        }

        if (/^Задани[яе]/.test(currentTab)) {
            return (
                <VariantsTab
                    labNumber={labNumber}
                    taskContent={taskContent}
                    variantsCount={variantsCount}
                    onVariantClick={openVariant}
                />
            );
        }

        if (currentTab === 'Пример') {
            return <div className="accordion-container"><Accordion labNumber={labNumber} /></div>;
        }

        if (currentTab === 'Теория') return <TheoryTab theoryContent={theoryContent} />;

        if (currentTab.startsWith('Вариант №')) {
            return <TaskTab taskContent={taskContent} taskContentRef={taskContentRef} />;
        }

        return null;
    };

    return (
        <div className="App">
            {showNotification && (
                <div className="notification">
                    Чтобы масштабировать страницу, используйте сочетание клавиш Ctrl + колесико мыши.
                </div>
            )}

            <div className="background" style={{ background: COLOR_THEMES[themeIndex] }} />

            <ColorPicker colors={COLOR_THEMES} selectedColorIndex={themeIndex} onColorChange={setThemeIndex} />
            <InfoModal />
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabClick={navigateToTab} />

            {renderContent()}
        </div>
    );
}

export default App;