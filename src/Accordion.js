import React, { useState, useEffect } from 'react';
import { labFiles } from './Globals'; // Импортируем labFiles
import './Accordion.css';

const Accordion = ({ labNumber }) => {
    const [activeIndexes, setActiveIndexes] = useState([]); // Массив активных вкладок
    const [contents, setContents] = useState([]); // Содержимое HTML для каждой вкладки

    // Получаем шаги для выбранной лабораторной работы
    const steps = labFiles[labNumber]?.example?.steps_paths || [];

    // Загрузка HTML содержимого для каждой вкладки
    useEffect(() => {
        console.log('step_paths:', steps);

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

    const stepTitles = labFiles[labNumber]?.example?.steps_counters || [];

    return (
        <div className="accordion">
            {steps.map((step, index) => (
                <div key={index} className="accordion-item">
                    <div
                        className={`accordion-title ${activeIndexes.includes(index) ? 'active' : ''}`}
                        onClick={() => toggleAccordion(index)}
                    >
                        {stepTitles[index] || `Шаг ${index + 1}`}
                        <span className="accordion-toggle">
                            {activeIndexes.includes(index) ? '-' : '+'}
                        </span>
                    </div>
                    {activeIndexes.includes(index) && (
                        <div
                            className="accordion-content"
                            dangerouslySetInnerHTML={{ __html: contents[index] }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Accordion;
