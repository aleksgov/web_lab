import { useState, useEffect } from 'react';

async function fetchContent(id, signal) {
    const res = await fetch(`/content/${id}`, { signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.text();
}

export function useLabContent(theoryId, taskId) {
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent,   setTaskContent]   = useState('');

    useEffect(() => {
        if (!theoryId && !taskId) return;

        const ctrl = new AbortController();

        Promise.all([
            theoryId ? fetchContent(theoryId, ctrl.signal) : Promise.resolve(''),
            taskId   ? fetchContent(taskId,   ctrl.signal) : Promise.resolve(''),
        ]).then(([theory, task]) => {
            setTheoryContent(theory);
            setTaskContent(task);
        }).catch(err => {
            if (err.name !== 'AbortError') console.error('Content load error:', err);
        });

        return () => ctrl.abort();
    }, [theoryId, taskId]);

    return { theoryContent, taskContent };
}
