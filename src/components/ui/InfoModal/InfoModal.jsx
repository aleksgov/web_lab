import React, { useState, useEffect } from 'react';
import styles from './InfoModal.module.css';

const InfoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');

    const handleToggle = () => setIsOpen(prev => !prev);

    useEffect(() => {
        if (!isOpen) return;
        const controller = new AbortController();

        fetch('/documentation/instructions.html', { signal: controller.signal })
            .then(r => r.text())
            .then(setHtmlContent)
            .catch(err => {
                if (err.name !== 'AbortError') console.error('Fetch error:', err);
            });

        return () => controller.abort();
    }, [isOpen]);

    return (
        <>
            <button className={styles.button} onClick={handleToggle}>
                <span className={styles.buttonText}>i</span>
            </button>

            {isOpen && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={handleToggle}>&times;</button>
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                </div>
            )}
        </>
    );
};

export default InfoModal;