import React from 'react';
import styles from './NumberButton.module.css';

export default function NumberButton({ number, text, onClick }) {
    return (
        <button className={styles.button} onClick={onClick}>
            <span className={styles.number}>{number}</span>
            <span className={styles.text}>{text}</span>
        </button>
    );
}