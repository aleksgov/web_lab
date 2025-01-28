import React from 'react';
import '../styles/NumberButton.css';

export default function NumberButton({ number, text, onClick }) {
    return (
        <button className="number-button-container" onClick={onClick}>
            <span className="number-button-number">{number}</span>
            <span className="number-button-text">{text}</span>
        </button>
    );
}