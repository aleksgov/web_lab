import React, { useState, useEffect } from 'react';
import '../styles/InfoModal.css';

const InfoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');

    const handleToggle = () => setIsOpen(prev => !prev);

    useEffect(() => {
        if (!isOpen) return;
        const controller = new AbortController();

        fetch('/documentation/instructions.html', { signal: controller.signal })
            .then((response) => response.text())
            .then(setHtmlContent)
            .catch((error) => {
                if (error.name !== 'AbortError') console.error('Fetch error:', error);
            });

        return () => controller.abort();
    }, [isOpen]);

    return (
        <>
            <button className="info-button" onClick={handleToggle}>
                <span className="info-text">i</span>
            </button>

            {isOpen && (
                <div className="info-modal">
                    <div className="info-content">
                        <button className="close-button" onClick={handleToggle}>&times;</button>
                        <div className="modal-container" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                </div>
            )}
        </>
    );
};

export default InfoModal;