import { useState, useEffect } from 'react';

export function useManifest(labNumber) {
    const [manifest, setManifest] = useState(null);
    const [loading,  setLoading]  = useState(false);

    useEffect(() => {
        if (!labNumber) { setManifest(null); setLoading(false); return; }

        setLoading(true);
        const ctrl = new AbortController();

        fetch(`/materials/lab${labNumber}/manifest.json`, { signal: ctrl.signal })
            .then(r => {
                if (!r.ok) throw new Error(`Manifest not found: ${r.status}`);
                return r.json();
            })
            .then(data => { setManifest(data); setLoading(false); })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error(`Manifest load error (lab ${labNumber}):`, err);
                    setLoading(false);
                }
            });

        return () => ctrl.abort();
    }, [labNumber]);

    return { manifest, loading };
}
