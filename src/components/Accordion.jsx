import React, { useState, useEffect } from 'react';
import { labFiles } from '../Globals'; // Импортируем labFiles
import '../styles/Accordion.css';
import SyntaxHighlighter from './SyntaxHighlighter';

const Accordion = ({ labNumber }) => {
    const [activeIndexes, setActiveIndexes] = useState([]); // Массив активных вкладок
    const [contents, setContents] = useState([]); // Содержимое HTML для каждой вкладки

    // Получаем шаги для выбранной лабораторной работы
    const steps = labFiles[labNumber]?.example?.steps_paths || [];
    const stepTitles = labFiles[labNumber]?.example?.steps_counters || [];
    const stepHeaders = labFiles[labNumber]?.example?.steps_headers || [];

    // Загрузка HTML содержимого для каждой вкладки
    useEffect(() => {
        const loadContent = async () => {
            const fetchedContents = [];
            for (let i = 0; i < steps.length; i++) {
                try {
                    const response = await fetch(steps[i]);
                    const text = await response.text();
                    fetchedContents.push(text);
                } catch (error) {
                    console.error(`Ошибка при загрузке файла ${steps[i]}`, error);
                    fetchedContents.push('<p>Не удалось загрузить содержимое.</p>');
                }
            }
            setContents(fetchedContents);
        };

        loadContent();
    }, [steps]);

    const toggleAccordion = (index) => {
        if (activeIndexes.includes(index)) {
            setActiveIndexes(activeIndexes.filter((i) => i !== index));
        } else {
            setActiveIndexes([...activeIndexes, index]);
        }
    };

    return (
        <div className="accordion">
            {steps.map((step, index) => (
                <div key={index} className="accordion-item">
                    <div
                        className={`accordion-title ${activeIndexes.includes(index) ? 'active' : ''}`}
                        onClick={() => toggleAccordion(index)}
                    >
                        <span className="step-counter">{stepTitles[index] || `Шаг ${index + 1}`}</span>
                        <span className="step-header">{stepHeaders[index]}</span>
                        <span className="accordion-toggle">
                            <img
                                src={activeIndexes.includes(index) ? 'assets/up_arrow.png' : 'assets/down_arrow.png'}
                                alt={activeIndexes.includes(index) ? 'Minus' : 'Plus'}
                            />
                        </span>
                    </div>
                    {activeIndexes.includes(index) && (
                        <>
                            <div className="accordion-line"></div>
                            <div className="accordion-content">
                                <SyntaxHighlighter htmlContent={contents[index]} />
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Accordion;
