import React from 'react';
import '../../styles/LabWorkTab.css';

const LabWorkTab = ({ currentTab, onTheoryClick, onExampleClick, onTasksClick }) => {
    return (
        <div className="content-box content-box-lab">
            <div className="lab-work-title">{currentTab}</div>
            <div className="lab-buttons-container">
                <button className="lab-button" onClick={onTheoryClick}>Теория</button>
                <button className="lab-button" onClick={onExampleClick}>Пример</button>
            </div>
            <button className="lab-button lab-button-variants" onClick={onTasksClick}>
                Варианты заданий
            </button>
        </div>
    );
};

export default LabWorkTab;