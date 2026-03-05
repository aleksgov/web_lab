import React from 'react';
import '../../styles/TasksTab.css';
import SyntaxHighlighter from '../ui/SyntaxHighlighter';
import { LABS_WITHOUT_VARIANTS } from '../../config/labs.config';

const VariantsTab = ({ labNumber, taskContent, variantsCount, onVariantClick }) => {
    if (LABS_WITHOUT_VARIANTS.has(labNumber)) {
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
                        onClick={() => onVariantClick(index)}
                    >
                        <span className="task-button-number">{index + 1}</span>
                        <span className="task-button-text">Вариант</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VariantsTab;