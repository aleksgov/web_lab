import React, { useRef, useLayoutEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

const SyntaxHighlighter = ({ htmlContent, className = '' }) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
        if (!ref.current) return;
        ref.current.querySelectorAll('code').forEach(el => hljs.highlightElement(el));
    }, [htmlContent]);

    return (
        <div
            ref={ref}
            className={className}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default SyntaxHighlighter;