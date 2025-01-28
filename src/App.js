import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './styles/App.css';
import { labFiles } from './Globals';
import Accordion from './components/Accordion';
import NumberButton from './components/NumberButton';
import SyntaxHighlighter from './components/SyntaxHighlighter';
import MainTab from './components/Tabs/MainTab';

const COLORS = [
    "linear-gradient(149deg, rgba(255, 144, 0, 0.52) 0%, rgba(0, 102, 174, 0.52) 100%)",
    "linear-gradient(149deg, rgba(255, 108, 0, 0.52) 0%, rgba(0, 158, 142, 0.52) 100%)",
    "linear-gradient(149deg, rgba(166, 136, 0, 0.52) 0%, rgba(29, 7, 114, 0.52) 100%)",
    "linear-gradient(149deg, rgba(180, 13, 0, 0.52) 0%, rgba(0, 102, 174, 0.52) 100%)",
];

function App() {
    const taskContentRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState(['Главная']);
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [activeVariant, setActiveVariant] = useState(1);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
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

    const handleInfoClick = useCallback(() => setIsInfoOpen(v => !v), []);
    const handleColorButtonClick = useCallback((index) => {
        setSelectedButtonIndex(index);
        setMenuVisible(false);
    }, []);

    useEffect(() => {
        if (!isInfoOpen) return;
        const controller = new AbortController();

        fetch('/documentation/instructions.html', { signal: controller.signal })
            .then((response) => response.text())
            .then(setHtmlContent)
            .catch((error) => {
                if (error.name !== 'AbortError') console.error('Fetch error:', error);
            });

        return () => controller.abort();
    }, [isInfoOpen]);

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

    const renderTabs = useMemo(() =>
            tabs.map((tab, index) => (
                <React.Fragment key={tab}>
                    <div
                        className={`tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => closeOtherTabs(index)}
                    >
                        {tab}
                    </div>
                    {index !== tabs.length - 1 && <div className="arrow">→</div>}
                </React.Fragment>
            )),
        [tabs, activeTab, closeOtherTabs]
    );

    const renderContent = useMemo(() => {
        if (activeTab === 0) return <MainTab renderLabButton={renderLabButton} />;

        const currentTab = tabs[activeTab];
        if (!currentTab) return null;

        switch(true) {
            case currentTab.startsWith("Лабораторная работа"):
                return (
                    <div className="content-box content-box-lab">
                        <div className="lab-work-title">{currentTab}</div>
                        <div className="lab-buttons-container">
                            <button className="lab-button" onClick={handleTheoryClick}>Теория</button>
                            <button className="lab-button" onClick={handleExampleClick}>Пример</button>
                        </div>
                        <button className="lab-button lab-button-variants" onClick={handleTasksClick}>
                            Варианты заданий
                        </button>
                    </div>
                );

            case /^Задани([яе])/.test(currentTab):
                return ['3', '4'].includes(labNumber) ? (
                    <div className="theory-container">
                        <SyntaxHighlighter className="theory-content" htmlContent={taskContent} />
                    </div>
                ) : (
                    <div className="task-variants-container">
                        <div className="task-buttons">
                            {Array.from({ length: variantsCount }, (_, index) => (
                                <button
                                    key={index}
                                    className={`task-button ${index + 1 >= 10 ? 'two-digit' : ''}`}
                                    onClick={() => handleVariantClick(index)}
                                >
                                    <span className="task-button-number">{index + 1}</span>
                                    <span className="task-button-text">Вариант</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case currentTab === 'Пример':
                return <div className="accordion-container"><Accordion labNumber={labNumber}/></div>;

            case currentTab === 'Теория':
                return (
                    <div className="theory-container">
                        <SyntaxHighlighter className="theory-content" htmlContent={theoryContent}/>
                    </div>
                );

            case currentTab.startsWith("Вариант №"):
                return (
                    <div className="theory-container">
                        <div ref={taskContentRef} className="theory-content" dangerouslySetInnerHTML={{ __html: taskContent }} />
                    </div>
                );

            default:
                return null;
        }
    }, [activeTab, tabs, labNumber, variantsCount, taskContent, theoryContent, renderLabButton, handleTheoryClick, handleExampleClick, handleTasksClick, handleVariantClick]);

    return (
        <div className="App">
            <div className="background" style={{ background: COLORS[selectedButtonIndex] }}></div>

            <div className="color-buttons-container">
                <button
                    className="color-button"
                    style={{ background: COLORS[selectedButtonIndex] }}
                    onClick={() => setMenuVisible(v => !v)}
                />

                {menuVisible && (
                    <div className="color-menu">
                        {COLORS.map((color, index) => index !== selectedButtonIndex && (
                            <button
                                key={color}
                                className="color-button"
                                style={{ background: color }}
                                onClick={() => handleColorButtonClick(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <button className="info-button" onClick={handleInfoClick}>
                <span className="info-text">i</span>
            </button>

            {isInfoOpen && (
                <div className="info-modal">
                    <div className="info-content">
                        <button className="close-button" onClick={handleInfoClick}>&times;</button>
                        <div className="modal-container" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                </div>
            )}

            <div className="tabs-container">{renderTabs}</div>
            {renderContent}
        </div>
    );
}

export default App;