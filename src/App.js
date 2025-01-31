import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './styles/App.css';
import { labFiles } from './Globals';
import Accordion from './components/Accordion';
import NumberButton from './components/NumberButton';
import MainTab from './components/Tabs/MainTab';
import TheoryTab from './components/Tabs/TheoryTab';
import VariantsTab from './components/Tabs/VariantsTab';
import LabWorkTab from './components/Tabs/LabWorkTab';
import TaskTab from './components/Tabs/TaskTab';
import ColorPicker from './components/ColorPicker';
import InfoModal from './components/InfoModal';
import { COLOR_THEMES, DEFAULT_THEME_INDEX } from './constants/theme';
import TabNavigation from './components/TabNavigation';

function App() {
    const taskContentRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState(['Главная']);
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [activeVariant, setActiveVariant] = useState(1);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(DEFAULT_THEME_INDEX);
    const [labNumber, setLabNumber] = useState(null);

    useEffect(() => {
        if (activeTab !== 0 && tabs[activeTab].startsWith('Лабораторная работа')) {
            const match = tabs[activeTab].match(/Лабораторная работа №\s*(\d+)/);
            setLabNumber(match ? match[1] : null);
        }
    }, [activeTab, tabs]);

    const variantsCount = useMemo(
        () => labFiles[labNumber]?.tasks?.count || 30,
        [labNumber]
    );

    const loadTheoryContent = useCallback(async (labNumber) => {
        if (!labFiles[labNumber]?.theory) {
            console.error(`Theory file for lab ${labNumber} not found`);
            return;
        }

        try {
            const response = await fetch(labFiles[labNumber].theory);
            setTheoryContent(await response.text());
        } catch (error) {
            console.error('Error loading theory:', error);
        }
    }, []);

    const loadTaskContent = useCallback(async () => {
        if (!labNumber || !labFiles[labNumber]?.tasks?.path) {
            console.error(`Task file for lab ${labNumber} not found`);
            return;
        }

        try {
            const response = await fetch(labFiles[labNumber].tasks.path);
            setTaskContent(await response.text());
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }, [labNumber]);

    useEffect(() => {
        if (activeTab === 0 || !tabs[activeTab].startsWith('Лабораторная работа')) return;
        if (labNumber) loadTheoryContent(labNumber);
    }, [activeTab, labNumber, loadTheoryContent, tabs]);

    useEffect(() => {
        if (activeTab !== 0) loadTaskContent();
    }, [activeTab, labNumber, loadTaskContent]);

    const showVariant = useCallback((variantIndex) => {
        const variants = taskContentRef.current?.querySelectorAll('.variant') || [];
        variants.forEach(v => v.classList.remove('active'));
        taskContentRef.current?.querySelector(`#variant-${variantIndex}`)?.classList.add('active');
    }, []);

    useEffect(() => {
        showVariant(activeVariant);
    }, [activeVariant, showVariant, taskContent]);

    const addTab = useCallback((title) => {
        setTabs(prev => {
            const existingIndex = prev.findIndex(tab => tab === title);
            if (existingIndex !== -1) return prev;
            return [...prev, title];
        });
        setActiveTab(prev => Math.max(prev, tabs.length));
    }, [tabs.length]);

    const closeOtherTabs = useCallback((index) => {
        setTabs(prev => prev.slice(0, index + 1));
        setActiveTab(index);
    }, []);

    const handleTheoryClick = useCallback(() => addTab("Теория"), [addTab]);
    const handleExampleClick = useCallback(() => addTab("Пример"), [addTab]);
    const handleTasksClick = useCallback(() => {
        addTab(labFiles[labNumber]?.tasks?.count ? "Задания" : "Задание");
    }, [addTab, labNumber]);

    const handleVariantClick = useCallback((index) => {
        const variantIndex = index + 1;
        setActiveVariant(variantIndex);
        addTab(`Вариант №${variantIndex}`);
    }, [addTab]);

    const renderLabButton = useCallback(
        (number) => (
            <NumberButton
                key={number}
                number={number}
                text="Лабораторная работа"
                onClick={() => addTab(`Лабораторная работа №${number}`)}
            />
        ),
        [addTab]
    );

    const renderContent = useMemo(() => {
        if (activeTab === 0) return <MainTab renderLabButton={renderLabButton} />;

        const currentTab = tabs[activeTab];
        if (!currentTab) return null;

        switch(true) {
            case currentTab.startsWith("Лабораторная работа"):
                return (
                    <LabWorkTab
                        currentTab={currentTab}
                        handleTheoryClick={handleTheoryClick}
                        handleExampleClick={handleExampleClick}
                        handleTasksClick={handleTasksClick}
                    />
                );

            case /^Задани([яе])/.test(currentTab):
                return (
                    <VariantsTab
                        labNumber={labNumber}
                        taskContent={taskContent}
                        variantsCount={variantsCount}
                        handleVariantClick={handleVariantClick}
                    />
                );

            case currentTab === 'Пример':
                return <div className="accordion-container"><Accordion labNumber={labNumber}/></div>;

            case currentTab === 'Теория':
                return <TheoryTab theoryContent={theoryContent} />;

            case currentTab.startsWith("Вариант №"):
                return <TaskTab taskContent={taskContent} taskContentRef={taskContentRef} />;

            default:
                return null;
        }
    }, [activeTab, tabs, labNumber, variantsCount, taskContent, theoryContent, renderLabButton, handleTheoryClick, handleExampleClick, handleTasksClick, handleVariantClick]);

    return (
        <div className="App">
            <div className="background" style={{background: COLOR_THEMES[selectedButtonIndex]}}></div>

            <ColorPicker
                colors={COLOR_THEMES}
                selectedColorIndex={selectedButtonIndex}
                onColorChange={setSelectedButtonIndex}
            />

            <InfoModal />

            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                closeOtherTabs={closeOtherTabs}
            />

            {renderContent}
        </div>
    );
}

export default App;