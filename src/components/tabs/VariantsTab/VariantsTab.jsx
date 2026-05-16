import React from 'react';
import styles from './VariantsTab.module.css';
import theoryStyles from '../TheoryTab/TheoryTab.module.css';
import SyntaxHighlighter from '../../ui/SyntaxHighlighter';

const VariantsTab = ({ hasVariants, taskContent, variantsCount, onVariantClick }) => {
    if (!hasVariants) {
        return (
            <div className={theoryStyles.container}>
                <SyntaxHighlighter className={theoryStyles.content} htmlContent={taskContent} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                {Array.from({ length: variantsCount }, (_, index) => (
                    <button
                        key={index}
                        className={`${styles.button} ${index + 1 >= 10 ? styles.buttonTwoDigit : ''}`}
                        onClick={() => onVariantClick(index)}
                    >
                        <span className={styles.buttonNumber}>{index + 1}</span>
                        <span className={styles.buttonText}>Вариант</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VariantsTab;
