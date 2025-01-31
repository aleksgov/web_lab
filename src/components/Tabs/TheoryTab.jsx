import React from 'react';
import '../../styles/TheoryTab.css';
import SyntaxHighlighter from '../SyntaxHighlighter';

const TheoryTab = ({ theoryContent }) => {
    return (
        <div className="theory-container">
            <SyntaxHighlighter className="theory-content" htmlContent={theoryContent} />
        </div>
    );
};

export default TheoryTab;