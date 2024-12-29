import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { labFiles } from './Globals';
import Accordion from './Accordion'; // Импорт компонента аккордеона

function App() {
    const taskContentRef = useRef(null);
    const [forceUpdate, setForceUpdate] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState([{ title: 'Главная', content: 'Контент главной страницы' },]);
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [labNumber, setLabNumber] = useState(null); // Состояние для хранения номера лабораторной работы
    const [activeVariant, setActiveVariant] = useState(1);
    const [variantsCount, setVariantsCount] = useState(30);

    const causeAnUpdate = () => setForceUpdate(Math.random());

    const getLabNumberFromTitle = (title) => {
        const match = title.match(/Лабораторная работа №\s*(\d+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        if (activeTab !== 0 && tabs[activeTab]?.title.startsWith('Лабораторная работа')) {
            const labNumberFromTitle = getLabNumberFromTitle(tabs[activeTab]?.title);
            if (labNumberFromTitle) {
                setLabNumber(labNumberFromTitle);

                const theoryFilePath = labFiles[labNumberFromTitle]?.theory;
                if (theoryFilePath) {
                    fetch(theoryFilePath)
                        .then((response) => response.text())
                        .then(setTheoryContent)
                        .catch((error) => console.error('Ошибка при загрузке теории:', error));
                } else {
                    console.error(`Файл теории для лабораторной работы №${labNumberFromTitle} не найден`);
                }
            }
        }
    }, [activeTab, tabs]);

    useEffect(() => {
        if (taskContent && taskContentRef.current) {
            showVariant(activeVariant);
        }
    }, [taskContent, activeVariant, taskContentRef, forceUpdate]);

    const addTab = (title, content = '') => {
        const existingTabIndex = tabs.findIndex((tab) => tab.title === title);
        if (existingTabIndex !== -1) {
            setActiveTab(existingTabIndex);
        } else {
            setTabs([
                ...tabs,
                { title, content },
            ]);
            setActiveTab(tabs.length);
        }
    };

    const loadTaskContent = () => {
        const taskFilePath = labFiles[labNumber]?.tasks?.path;
        const variantsCount = labFiles[labNumber]?.tasks?.count;
        if (taskFilePath) {
            fetch(taskFilePath)
                .then((response) => response.text())
                .then(setTaskContent)
                .catch((error) => console.error('Ошибка при загрузке задания:', error));
        } else {
            console.error(`Файл задания для лабораторной работы №${labNumber} не найден`);
        }
    };

    const showVariant = (variantIndex) => {
        if (taskContentRef.current) {
            const variants = taskContentRef.current.querySelectorAll('.variant');
            variants.forEach((variant) => variant.classList.remove('active'));
            const selectedVariant = taskContentRef.current.querySelector(`#variant-${variantIndex}`);
            if (selectedVariant) {
                selectedVariant.classList.add('active');
            }
        }
    };

    const closeOtherTabs = (index) => {
        setTabs((prevTabs) => prevTabs.slice(0, index + 1));
        setActiveTab(index);
    };

    const getContentBoxStyle = (tabTitle) => {
        if (tabTitle.startsWith("Лабораторная работа")) {
            return { width: '1098px', height: '612px' };
        }
    };

    const handleTheoryClick = () => {
        addTab("Теория", "");
    };

    const handleExampleClick = () => {
        addTab("Пример", "");
    };

    const handleTasksClick = () => {
        const variantsCount = labFiles[labNumber]?.tasks?.count;
        if (variantsCount) {
            setVariantsCount(variantsCount);
        }
        addTab("Задания", "");
    };

    const handleVariantClick = (index) => {
        const variantIndex = index + 1;
        setActiveVariant(variantIndex);
        causeAnUpdate();
        loadTaskContent();
        addTab(`Вариант №${variantIndex}`, "");
    };

    return (
        <div className="App">
            <div className="background" />
            <div className="tabs-container">
                {tabs.map((tab, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`tab ${activeTab === index ? 'active' : ''}`}
                            onClick={() => closeOtherTabs(index)}
                        >
                            {tab.title}
                        </div>
                        {index !== tabs.length - 1 && <div className="arrow">→</div>}
                    </React.Fragment>
                ))}
            </div>

            {/* Вкладка "Главная" */}
            {activeTab === 0 && (
                <div className="content-box">
                    <div className="tab-content">
                        <div className="main-tab-content">
                            <div className="header-text">
                                Лабораторный практикум<br />по предмету “Управление данными”
                            </div>
                            <div className="main-buttons-container">
                                {[1, 2, 3, 4].map((number) => (
                                    <button
                                        key={number}
                                        className="main-button"
                                        onClick={() => addTab(`Лабораторная работа №${number}`)}
                                    >
                                        <div className="main-button-text">
                                            Лабораторная <br /> работа
                                        </div>
                                        <div className="main-button-number">{number}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Вкладка "Лабораторная работа" */}
            {activeTab !== 0 && tabs[activeTab]?.title.startsWith("Лабораторная работа") && (
                <div className="content-box" style={getContentBoxStyle(tabs[activeTab]?.title)}>
                    <div className="tab-content">
                        <div className="lab-work-title">
                            {tabs[activeTab]?.title}
                        </div>
                        <p>{tabs[activeTab]?.content}</p>
                        <div className="lab-buttons-container">
                            <button className="lab-button" onClick={handleTheoryClick}>Теория</button>
                            <button className="lab-button" onClick={handleExampleClick}>Пример</button>
                        </div>
                        <button className="lab-button lab-button-variants" onClick={handleTasksClick}>Варианты заданий</button>
                    </div>
                </div>
            )}

            {/* Вкладка "Задания" */}
            {activeTab !== 0 && tabs[activeTab]?.title === 'Задания' && (
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
            )}

            {/* Вкладка "Пример" */}
            {activeTab !== 0 && tabs[activeTab]?.title === 'Пример' && (
                <div className="accordion-container">
                    <Accordion labNumber={labNumber} />
                </div>
            )}

            {/* Вкладка "Теория" */}
            {activeTab !== 0 && tabs[activeTab]?.title === 'Теория' && (
                <div className="theory-container">
                    <div className="theory-content" dangerouslySetInnerHTML={{ __html: theoryContent }} />
                </div>
            )}

            {/* Вкладка "Вариант" */}
            {activeTab !== 0 && tabs[activeTab]?.title.startsWith("Вариант №") && (
                <div className="theory-container">
                    <div ref={taskContentRef} className="theory-content" dangerouslySetInnerHTML={{ __html: taskContent }} />
                </div>
            )}
        </div>
    );
}

export default App;
