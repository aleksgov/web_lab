import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { labFiles } from './Globals';
import Accordion from './Accordion';
import SyntaxHighlighter from './SyntaxHighlighter';

function App() {
    const taskContentRef = useRef(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState([{ title: 'Главная', content: 'Контент главной страницы' }]);
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [labNumber, setLabNumber] = useState(null);
    const [activeVariant, setActiveVariant] = useState(1);
    const [variantsCount, setVariantsCount] = useState(30);
    const [backgroundStyle, setBackgroundStyle] = useState();

    // Обновление компонента
    const causeAnUpdate = () => setForceUpdate(Math.random());

    // Извлечение номера лабораторной работы из заголовка
    const getLabNumberFromTitle = (title) => {
        const match = title.match(/Лабораторная работа №\s*(\d+)/);
        return match ? match[1] : null;
    };

    // Загрузка теории при смене вкладки
    useEffect(() => {
        if (activeTab !== 0 && tabs[activeTab]?.title.startsWith('Лабораторная работа')) {
            const labNumberFromTitle = getLabNumberFromTitle(tabs[activeTab]?.title);
            if (labNumberFromTitle) {
                setLabNumber(labNumberFromTitle);
                loadTheoryContent(labNumberFromTitle);
            }
        }
    }, [activeTab, tabs]);

    useEffect(() => {
        loadTaskContent();
    }, [activeTab, labNumber]);

    // Загрузка задания при изменении содержимого задания или варианта
    useEffect(() => {
        if (taskContent && taskContentRef.current) {
            showVariant(activeVariant);
        }
    }, [taskContent, activeVariant, taskContentRef, forceUpdate]);

    // Функция для добавления вкладки
    const addTab = (title, content = '') => {
        const existingTabIndex = tabs.findIndex((tab) => tab.title === title);
        if (existingTabIndex !== -1) {
            setActiveTab(existingTabIndex);
        } else {
            setTabs((prevTabs) => [...prevTabs, { title, content }]);
            setActiveTab(tabs.length);
        }
    };

    // Загрузка теории
    const loadTheoryContent = (labNumberFromTitle) => {
        const theoryFilePath = labFiles[labNumberFromTitle]?.theory;
        if (theoryFilePath) {
            fetch(theoryFilePath)
                .then((response) => response.text())
                .then(setTheoryContent)
                .catch((error) => console.error('Ошибка при загрузке теории:', error));
        } else {
            console.error(`Файл теории для лабораторной работы №${labNumberFromTitle} не найден`);
        }
    };

    // Загрузка задания
    const loadTaskContent = () => {
        if (labNumber == null) {
            return;
        }

        const taskFilePath = labFiles[labNumber]?.tasks?.path;
        if (taskFilePath) {
            fetch(taskFilePath)
                .then((response) => response.text())
                .then(setTaskContent)
                .catch((error) => console.error('Ошибка при загрузке задания:', error));
        } else {
            console.error(`Файл задания для лабораторной работы №${labNumber} не найден`);
        }
    };

    // Отображение выбранного варианта задания
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

    // Закрытие других вкладок
    const closeOtherTabs = (index) => {
        setTabs((prevTabs) => prevTabs.slice(0, index + 1));
        setActiveTab(index);
    };

    // Стиль контента для лабораторной работы
    const getContentBoxStyle = (tabTitle) => {
        if (tabTitle.startsWith("Лабораторная работа")) {
            return { width: '1098px', height: '612px' };
        }
    };

    // Обработчики кликов по кнопкам
    const handleTheoryClick = () => addTab("Теория", "");
    const handleExampleClick = () => addTab("Пример", "");
    const handleTasksClick = () => {
        const variantsCount = labFiles[labNumber]?.tasks?.count;
        if (variantsCount == null) {
            addTab("Задание", "");
        } else {
            if (variantsCount) {
                setVariantsCount(variantsCount);
            }
            addTab("Задания", "");
        }
    };

    const handleVariantClick = (index) => {
        const variantIndex = index + 1;
        setActiveVariant(variantIndex);
        causeAnUpdate();
        addTab(`Вариант №${variantIndex}`, "");
    };

    // Рендеринг вкладок
    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <React.Fragment key={index}>
                <div
                    className={`tab ${activeTab === index ? 'active' : ''}`}
                    onClick={() => closeOtherTabs(index)}
                >
                    {tab.title}
                </div>
                {index !== tabs.length - 1 && <div className="arrow">→</div>}
            </React.Fragment>
        ));
    };

    // Рендеринг содержимого в зависимости от активной вкладки
    const renderContent = () => {
        if (activeTab === 0) {
            return (
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
            );
        }

        if (tabs[activeTab]?.title.startsWith("Лабораторная работа")) {
            return (
                <div className="content-box" style={getContentBoxStyle(tabs[activeTab]?.title)}>
                    <div className="tab-content">
                        <div className="lab-work-title">{tabs[activeTab]?.title}</div>
                        <p>{tabs[activeTab]?.content}</p>
                        <div className="lab-buttons-container">
                            <button className="lab-button" onClick={handleTheoryClick}>Теория</button>
                            <button className="lab-button" onClick={handleExampleClick}>Пример</button>
                        </div>
                        <button className="lab-button lab-button-variants" onClick={handleTasksClick}>Варианты заданий</button>
                    </div>
                </div>
            );
        }

        if (/^Зад(ания|ание)/.test(tabs[activeTab]?.title)) {
            if (labNumber === '3') {
                return (
                    <div className="theory-container">
                        <SyntaxHighlighter className="theory-content" htmlContent={taskContent} />
                    </div>
                );
            }

            return (
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
        }

        if (tabs[activeTab]?.title === 'Пример') {
            return <div className="accordion-container"><Accordion labNumber={labNumber} /></div>;
        }

        if (tabs[activeTab]?.title === 'Теория') {
            return (
                <div className="theory-container">
                    <SyntaxHighlighter className="theory-content" htmlContent={theoryContent} />
                </div>
            );
        }

        if (tabs[activeTab]?.title.startsWith("Вариант №")) {
            return (
                <div className="theory-container">
                    <div ref={taskContentRef} className="theory-content" dangerouslySetInnerHTML={{ __html: taskContent }} />
                </div>
            );
        }

        return null;
    };

    const handleColorButtonClick = (style) => {
        setBackgroundStyle(style);
    };

    return (
        <div className="App">
            <div className="background" style={{background: backgroundStyle}}></div>
            {activeTab === 0 && (
                <div className="color-buttons-container">
                    <button className="color-button" onClick={() => handleColorButtonClick("linear-gradient(149deg, rgba(255, 144, 0, 0.52) 0%, rgba(0, 102, 174, 0.52) 100%)")}></button>
                    <button className="color-button" onClick={() => handleColorButtonClick("linear-gradient(149deg, rgba(255, 108, 0, 0.52) 0%, rgba(0, 158, 142, 0.52) 100%)")}></button>
                    <button className="color-button" onClick={() => handleColorButtonClick("linear-gradient(149deg, rgba(166, 136, 0, 0.52) 0%, rgba(29, 7, 114, 0.52) 100%)")}></button>
                    <button className="color-button" onClick={() => handleColorButtonClick("linear-gradient(149deg, rgba(180, 13, 0, 0.52) 0%, rgba(0, 102, 174, 0.52) 100%)")}></button>
                </div>
            )}
            <div className="tabs-container">
                {renderTabs()}
            </div>
            {renderContent()}
        </div>
    );
}

export default App;
