import React, { useState, useEffect } from 'react';
import { LAB_CONFIG } from '../../../config/labs.config';
import styles from './Accordion.module.css';
import SyntaxHighlighter from '../SyntaxHighlighter';

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
        <div className={styles.accordion}>
            {steps.map((step, index) => {
                const isOpen = openIndexes.has(index);
                return (
                    <div key={index} className={styles.item}>
                        <div
                            className={`${styles.title} ${isOpen ? styles.titleOpen : ''}`}
                            onClick={() => toggle(index)}
                        >
                            <span className={styles.stepCounter}>{step.counter}</span>
                            <span className={styles.stepHeader}>{step.header}</span>
                            <span className={styles.toggle}>
                                <img
                                    src={isOpen ? 'assets/up_arrow.png' : 'assets/down_arrow.png'}
                                    alt={isOpen ? 'Свернуть' : 'Развернуть'}
                                />
                            </span>
                        </div>
                        {isOpen && (
                            <>
                                <div className={styles.line} />
                                <div className={styles.content}>
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