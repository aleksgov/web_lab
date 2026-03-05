import { useState, useEffect } from 'react';
import { LAB_CONFIG } from '../config/labs.config';

async function fetchHtml(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.text();
}

export function useLabContent(labNumber) {
    const [theoryContent, setTheoryContent] = useState('');
    const [taskContent, setTaskContent] = useState('');

    useEffect(() => {
        if (!labNumber) return;
        const lab = LAB_CONFIG[labNumber];
        if (!lab) return;

        const controller = new AbortController();

        Promise.all([
            lab.theory ? fetchHtml(lab.theory) : Promise.resolve(''),
            lab.tasks?.path ? fetchHtml(lab.tasks.path) : Promise.resolve(''),
        ]).then(([theory, task]) => {
            setTheoryContent(theory);
            setTaskContent(task);
        }).catch(err => {
            if (err.name !== 'AbortError') console.error('Content load error:', err);
        });

        return () => controller.abort();
    }, [labNumber]);

    return { theoryContent, taskContent };
}