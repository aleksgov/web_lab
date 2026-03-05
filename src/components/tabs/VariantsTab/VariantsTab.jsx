import React from 'react';
import styles from './VariantsTab.module.css';
import theoryStyles from '../TheoryTab/TheoryTab.module.css';
import SyntaxHighlighter from '../../ui/SyntaxHighlighter';
import { LABS_WITHOUT_VARIANTS } from '../../../config/labs.config';

const VariantsTab = ({ labNumber, taskContent, variantsCount, onVariantClick }) => {
    if (LABS_WITHOUT_VARIANTS.has(labNumber)) {
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