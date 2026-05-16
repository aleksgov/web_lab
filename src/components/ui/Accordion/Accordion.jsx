import React, { useState, useEffect } from 'react';
import styles from './Accordion.module.css';
import SyntaxHighlighter from '../SyntaxHighlighter';

const Accordion = ({ examples }) => {
    const [openIndexes, setOpenIndexes] = useState(new Set());
    const [contents,    setContents]    = useState([]);

    useEffect(() => {
        setOpenIndexes(new Set());
        setContents([]);
        if (!examples.length) return;

        let cancelled = false;
        Promise.all(
            examples.map(id =>
                fetch(`/content/${id}`)
                    .then(r => r.ok ? r.text() : '<p>Не удалось загрузить содержимое.</p>')
                    .catch(() => '<p>Не удалось загрузить содержимое.</p>')
            )
        ).then(results => { if (!cancelled) setContents(results); });

        return () => { cancelled = true; };
    }, [examples]);

    const toggle = (index) =>
        setOpenIndexes(prev => {
            const next = new Set(prev);
            next.has(index) ? next.delete(index) : next.add(index);
            return next;
        });

    return (
        <div className={styles.accordion}>
            {examples.map((id, index) => {
                const isOpen = openIndexes.has(index);
                return (
                    <div key={id} className={styles.item}>
                        <div
                            className={`${styles.title} ${isOpen ? styles.titleOpen : ''}`}
                            onClick={() => toggle(index)}
                        >
                            <span className={styles.stepCounter}>{`Пример ${index + 1}`}</span>
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
