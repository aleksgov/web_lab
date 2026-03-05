import React from 'react';
import styles from './TheoryTab.module.css';
import SyntaxHighlighter from '../../ui/SyntaxHighlighter';

const TheoryTab = ({ theoryContent }) => (
    <div className={styles.container}>
        <SyntaxHighlighter className={styles.content} htmlContent={theoryContent} />
    </div>
);

export default TheoryTab;