import React, { useRef, useLayoutEffect } from 'react';
import hljs from 'highlight.js';
import './SyntaxHighlighter.css';
import 'highlight.js/styles/atom-one-light.css';

const SyntaxHighlighter = ({ htmlContent, className = '' }) => {
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        if (contentRef.current) {
            const codeElements = contentRef.current.querySelectorAll("code");
            for (let element of codeElements) {
                hljs.highlightElement(element);
            }
        }
    }, [htmlContent]);

    return (
        <div
            ref={contentRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default SyntaxHighlighter;