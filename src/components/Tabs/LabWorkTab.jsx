import React from 'react';
import '../../styles/LabWorkTab.css';

const LabWorkTab = ({ currentTab, handleTheoryClick, handleExampleClick, handleTasksClick }) => {
    return (
        <div className="content-box content-box-lab">
            <div className="lab-work-title">{currentTab}</div>
            <div className="lab-buttons-container">
                <button className="lab-button" onClick={handleTheoryClick}>
                    Теория
                </button>
                <button className="lab-button" onClick={handleExampleClick}>
                    Пример
                </button>
            </div>
            <button className="lab-button lab-button-variants" onClick={handleTasksClick}>
                Варианты заданий
            </button>
        </div>
    );
};

export default LabWorkTab;