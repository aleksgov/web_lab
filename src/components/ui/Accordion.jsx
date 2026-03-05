import React, { useState, useEffect } from 'react';
import { LAB_CONFIG } from '../../config/labs.config';
import '../../styles/Accordion.css';
import SyntaxHighlighter from './SyntaxHighlighter';

const Accordion = ({ labNumber }) => {
    const [openIndexes, setOpenIndexes] = useState(new Set());
    const [contents, setContents]       = useState([]);

    const steps = LAB_CONFIG[labNumber]?.example?.steps ?? [];

    useEffect(() => {
        if (!steps.length) return;

        Promise.all(
            steps.map(step =>
                fetch(step.path)
                    .then(r => r.text())
                    .catch(() => '<p>Не удалось загрузить содержимое.</p>')
            )
        ).then(setContents);
    }, [labNumber]);

    const toggle = (index) =>
        setOpenIndexes(prev => {
            const next = new Set(prev);
            next.has(index) ? next.delete(index) : next.add(index);
            return next;
        });

    return (
        <div className="accordion">
            {steps.map((step, index) => {
                const isOpen = openIndexes.has(index);
                return (
                    <div key={index} className="accordion-item">
                        <div
                            className={`accordion-title ${isOpen ? 'active' : ''}`}
                            onClick={() => toggle(index)}
                        >
                            <span className="step-counter">{step.counter}</span>
                            <span className="step-header">{step.header}</span>
                            <span className="accordion-toggle">
                                <img
                                    src={isOpen ? 'assets/up_arrow.png' : 'assets/down_arrow.png'}
                                    alt={isOpen ? 'Свернуть' : 'Развернуть'}
                                />
                            </span>
                        </div>
                        {isOpen && (
                            <>
                                <div className="accordion-line" />
                                <div className="accordion-content">
                                    <SyntaxHighlighter htmlContent={contents[index] ?? ''} />
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;