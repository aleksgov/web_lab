import React from 'react';
import mainStyles from '../MainTab/MainTab.module.css';
import styles from './LabWorkTab.module.css';

const LabWorkTab = ({ currentTab, onTheoryClick, onExampleClick, onTasksClick }) => (
    <div className={`${mainStyles.contentBox} ${mainStyles.contentBoxLab}`}>
        <div className={styles.labTitle}>{currentTab}</div>
        <div className={styles.buttonsRow}>
            <button className={styles.button} onClick={onTheoryClick}>Теория</button>
            <button className={styles.button} onClick={onExampleClick}>Пример</button>
        </div>
        <button className={`${styles.button} ${styles.buttonWide}`} onClick={onTasksClick}>
            Варианты заданий
        </button>
    </div>
);

export default LabWorkTab;