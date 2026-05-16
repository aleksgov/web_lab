import React from 'react';
import mainStyles from '../MainTab/MainTab.module.css';
import styles from './LabWorkTab.module.css';

const LabWorkTab = ({
    currentTab,
    hasTheory,
    hasExamples,
    hasTasks,
    onTheoryClick,
    onExampleClick,
    onTasksClick,
}) => (
    <div className={`${mainStyles.contentBox} ${mainStyles.contentBoxLab}`}>
        <div className={styles.labTitle}>{currentTab}</div>
        {(hasTheory || hasExamples) && (
            <div className={styles.buttonsRow}>
                {hasTheory   && <button className={styles.button} onClick={onTheoryClick}>Теория</button>}
                {hasExamples && <button className={styles.button} onClick={onExampleClick}>Пример</button>}
            </div>
        )}
        {hasTasks && (
            <button className={`${styles.button} ${styles.buttonWide}`} onClick={onTasksClick}>
                Варианты заданий
            </button>
        )}
    </div>
);

export default LabWorkTab;
