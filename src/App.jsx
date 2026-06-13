import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './App.module.css';

import { COLOR_THEMES, DEFAULT_THEME_INDEX } from './config/theme.config';
import { useTabs }      from './hooks/useTabs';
import { useManifest }  from './hooks/useManifest';
import { useLabContent } from './hooks/useLabContent';

import ColorPicker   from './components/ui/ColorPicker';
import InfoModal     from './components/ui/InfoModal';
import TabNavigation from './components/layout/TabNavigation';
import Accordion     from './components/ui/Accordion';
import MainTab       from './components/tabs/MainTab';
import LabWorkTab    from './components/tabs/LabWorkTab';
import TheoryTab     from './components/tabs/TheoryTab';
import VariantsTab   from './components/tabs/VariantsTab';
import TaskTab       from './components/tabs/TaskTab';

function App() {
    const [themeIndex, setThemeIndex] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('datalab_theme_index'));
            if (Number.isInteger(stored) && stored >= 0 && stored < COLOR_THEMES.length) return stored;
        } catch {}
        return DEFAULT_THEME_INDEX;
    });
    const [showNotification, setShowNotification] = useState(false);
    const [activeVariant, setActiveVariant]       = useState(1);
    const taskContentRef = useRef(null);

    const { tabs, activeTab, addTab, navigateToTab, closeTab } = useTabs();
    const currentTab = tabs[activeTab]?.title ?? '';

    const labNumber = useMemo(() => {
        const tab = tabs[activeTab];
        if (!tab) return null;
        if (tab.labNumber != null) return String(tab.labNumber);
        const match = tab.title?.match(/Лабораторная работа №\s*(\d+)/);
        return match?.[1] ?? null;
    }, [tabs, activeTab]);

    const { manifest, loading: manifestLoading } = useManifest(labNumber);

    const examples = useMemo(() => manifest?.examples ?? [], [manifest]);

    const { theoryContent, taskContent } = useLabContent(
        manifest?.theory,
        manifest?.tasks?.[0],
    );

    useEffect(() => {
        if (currentTab !== 'Теория') { setShowNotification(false); return; }
        if (sessionStorage.getItem('datalab_scaling_notif_shown')) return;
        sessionStorage.setItem('datalab_scaling_notif_shown', '1');
        setShowNotification(true);
        const t = setTimeout(() => setShowNotification(false), 2000);
        return () => clearTimeout(t);
    }, [currentTab]);

    useEffect(() => {
        localStorage.setItem('datalab_theme_index', JSON.stringify(themeIndex));
    }, [themeIndex]);

    useEffect(() => {
        if (!taskContentRef.current || !activeVariant) return;
        taskContentRef.current.querySelectorAll('.variant').forEach(v => v.classList.remove('active'));
        taskContentRef.current.querySelector(`#variant-${activeVariant}`)?.classList.add('active');
    }, [activeVariant, taskContent]);

    const labNum = labNumber ? Number(labNumber) : null;

    const openTheory  = () => addTab({ title: 'Теория',  labNumber: labNum });
    const openExample = () => addTab({ title: 'Пример',  labNumber: labNum });
    const openTasks   = () => addTab({ title: manifest?.variantsCount ? 'Задания' : 'Задание', labNumber: labNum });
    const openVariant = (index) => {
        const n = index + 1;
        setActiveVariant(n);
        addTab({ title: `Вариант №${n}`, labNumber: labNum });
    };
    const openLab = (number) => addTab({ title: `Лабораторная работа №${number}`, labNumber: number });

    useEffect(() => {
        const match = currentTab.match(/^Вариант №(\d+)$/);
        if (match) setActiveVariant(Number(match[1]));
    }, [currentTab]);

    const hasTheory   = manifestLoading || !!manifest?.theory;
    const hasExamples = manifestLoading || examples.length > 0;
    const hasTasks    = manifestLoading || (manifest?.tasks?.length ?? 0) > 0;

    const renderContent = () => {
        if (activeTab === 0) return <MainTab onLabClick={openLab} />;

        if (currentTab.startsWith('Лабораторная работа')) {
            return (
                <LabWorkTab
                    currentTab={currentTab}
                    hasTheory={hasTheory}
                    hasExamples={hasExamples}
                    hasTasks={hasTasks}
                    onTheoryClick={openTheory}
                    onExampleClick={openExample}
                    onTasksClick={openTasks}
                />
            );
        }
        if (/^Задани[яе]/.test(currentTab)) {
            return (
                <VariantsTab
                    hasVariants={!!manifest?.variantsCount}
                    taskContent={taskContent}
                    variantsCount={manifest?.variantsCount ?? 0}
                    onVariantClick={openVariant}
                />
            );
        }
        if (currentTab === 'Пример') {
            return (
                <div className={styles.accordionContainer}>
                    <Accordion examples={examples} />
                </div>
            );
        }
        if (currentTab === 'Теория') return <TheoryTab theoryContent={theoryContent} />;
        if (currentTab.startsWith('Вариант №')) {
            return <TaskTab taskContent={taskContent} taskContentRef={taskContentRef} />;
        }
        return null;
    };

    return (
        <div className={styles.app}>
            {showNotification && (
                <div className={styles.notification}>
                    Чтобы масштабировать страницу, используйте сочетание клавиш Ctrl + колесико мыши.
                </div>
            )}

            <div className={styles.background} style={{ background: COLOR_THEMES[themeIndex] }} />

            <ColorPicker colors={COLOR_THEMES} selectedColorIndex={themeIndex} onColorChange={setThemeIndex} />
            <InfoModal />
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabClick={navigateToTab} onTabClose={closeTab} />

            {renderContent()}
        </div>
    );
}

export default App;