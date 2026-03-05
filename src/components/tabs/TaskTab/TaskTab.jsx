import React from 'react';
import styles from '../TheoryTab/TheoryTab.module.css';

const TaskTab = ({ taskContent, taskContentRef }) => (
    <div className={styles.container}>
        <div
            ref={taskContentRef}
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: taskContent }}
        />
    </div>
);

export default TaskTab;