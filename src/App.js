import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { labFiles } from './Globals';
import Accordion from './Accordion';
import NumberButton from './NumberButton';
import SyntaxHighlighter from './SyntaxHighlighter';

function App() {
    const taskContentRef = useRef(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState([ 'Главная' ]);
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [labNumber, setLabNumber] = useState(null);
    const [activeVariant, setActiveVariant] = useState(1);
    const [variantsCount, setVariantsCount] = useState(30);
    const [backgroundStyle, setBackgroundStyle] = useState('');
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const colors = [
        "linear-gradient(149deg, rgba(255, 144, 0, 0.52) 0%, rgba(0, 102, 174, 0.52) 100%)",
        "linear-gradient(149deg, rgba(255, 108, 0, 0.52) 0%, rgba(0, 158, 142, 0.52) 100%)",
        "linear-gradient(149deg, rgba(166, 136, 0, 0.52) 0%, rgba(29, 7, 114, 0.52) 100%)",
        "linear-gradient(149deg, rgba(180, 13, 0, 0.52) 0%, rgba(0, 102, 174, 0.52) 100%)",
    ];

    // Обновление компонента
    const causeAnUpdate = () => setForceUpdate(Math.random());

    // Извлечение номера лабораторной работы из заголовка
    const getLabNumberFromTitle = (title) => {
        const match = title.match(/Лабораторная работа №\s*(\d+)/);
        return match ? match[1] : null;
    };

    // Обработчик клика для кнопки с информацией
    const handleInfoClick = () => {
        setIsInfoOpen(!isInfoOpen);
    };

    // Файл для инструкции
    useEffect(() => {
        if (isInfoOpen) {
            fetch('/documentation/instructions.html')
                .then((response) => response.text())
                .then((data) => setHtmlContent(data));
        }
    }, [isInfoOpen]);

    // Загрузка теории при смене вкладки
    useEffect(() => {
        if (activeTab !== 0 && tabs[activeTab].startsWith('Лабораторная работа')) {
            const labNumberFromTitle = getLabNumberFromTitle(tabs[activeTab]);
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
    const addTab = (title) => {
        const existingTabIndex = tabs.findIndex((tab) => tab === title);
        if (existingTabIndex !== -1) {
            setActiveTab(existingTabIndex);
        } else {
            setTabs((prevTabs) => [...prevTabs, title]);
            setActiveTab(tabs.length);
        }
    };

    // Показать уведомление при активации вкладки "Теория"
    useEffect(() => {
        if (tabs[activeTab] === 'Теория') {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowNotification(false);
        }
    }, [activeTab, tabs]);

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

    // Обработчики кликов по кнопкам
    const handleTheoryClick = () => addTab("Теория");
    const handleExampleClick = () => addTab("Пример");
    const handleTasksClick = () => {
        const variantsCount = labFiles[labNumber]?.tasks?.count;
        if (variantsCount == null) {
            addTab("Задание");
        } else {
            if (variantsCount) {
                setVariantsCount(variantsCount);
            }
            addTab("Задания");
        }
    };

    const handleVariantClick = (index) => {
        const variantIndex = index + 1;
        setActiveVariant(variantIndex);
        causeAnUpdate();
        addTab(`Вариант №${variantIndex}`);
    };

    const handleColorButtonClick = (index) => {
        setBackgroundStyle(colors[index]);
        setSelectedButtonIndex(index);
        setMenuVisible(false);
    };

    // Рендеринг вкладок
    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <React.Fragment key={index}>
                <div
                    className={`tab ${activeTab === index ? 'active' : ''}`}
                    onClick={() => closeOtherTabs(index)}
                >
                    {tab}
                </div>
                {index !== tabs.length - 1 && <div className="arrow">→</div>}
            </React.Fragment>
        ));
    };

    const renderLabButton = (number) =>
        <NumberButton number={number} text="Лабораторная работа" onClick={() => addTab(`Лабораторная работа №${number}`)} />;

    // Рендеринг содержимого в зависимости от активной вкладки
    const renderContent = () => {
        if (activeTab === 0) {
            return (
                <div className="content-box">
                    <div className="main-tab-content">
                        <div className="header-text">
                            Лабораторный практикум<br/>по предмету “Управление данными”
                        </div>
                        <div className="buttons-container">
                            <div className="button-row">
                                {[1, 2, 3].map(renderLabButton)}
                            </div>
                            <div className="button-row">
                                {[4, 5].map(renderLabButton)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (!tabs[activeTab])
            return null;

        if (tabs[activeTab].startsWith("Лабораторная работа")) {
            return (
                <div
                    className={`content-box ${tabs[activeTab].startsWith("Лабораторная работа") ? 'content-box-lab' : ''}`}>
                    <div className="lab-work-title">{tabs[activeTab]}</div>
                    <div className="lab-buttons-container">
                        <button className="lab-button" onClick={handleTheoryClick}>Теория</button>
                        <button className="lab-button" onClick={handleExampleClick}>Пример</button>
                    </div>
                    <button className="lab-button lab-button-variants" onClick={handleTasksClick}>Варианты заданий
                    </button>
                </div>
            );
        }

        if (/^Задани([яе])/.test(tabs[activeTab])) {
            if (['3', '4'].includes(labNumber)) {
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

        if (tabs[activeTab] === 'Пример') {
            return <div className="accordion-container"><Accordion labNumber={labNumber}/></div>;
        }

        if (tabs[activeTab] === 'Теория') {
            return (
                <div className="theory-container">
                    <SyntaxHighlighter className="theory-content" htmlContent={theoryContent}/>
                </div>
            );
        }

        if (tabs[activeTab].startsWith("Вариант №")) {
            return (
                <div className="theory-container">
                    <div ref={taskContentRef} className="theory-content" dangerouslySetInnerHTML={{ __html: taskContent }} />
                </div>
            );
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
            <div className="background" style={{background: backgroundStyle}}></div>
            <div className="color-buttons-container">
                <button
                    className="color-button"
                    style={{background: colors[selectedButtonIndex]}}
                    onClick={() => setMenuVisible(!menuVisible)}
                ></button>

                {menuVisible && (
                    <div className="color-menu">
                        {colors.map((color, index) => (
                            index !== selectedButtonIndex && (
                                <button
                                    key={index}
                                    className="color-button"
                                    style={{background: color}}
                                    onClick={() => handleColorButtonClick(index)}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
            <button
                className="info-button"
                onClick={handleInfoClick}
            >
                <span className="info-text">i</span>
            </button>
            {isInfoOpen && (
                <div className="info-modal">
                    <div className="info-content">
                        <button className="close-button" onClick={handleInfoClick}>
                            &times;
                        </button>
                        <div className="modal-container" dangerouslySetInnerHTML={{__html: htmlContent}}/>
                    </div>
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
