'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3001;

const PUBLIC_DIR    = path.resolve(__dirname, 'public');
const MATERIALS_DIR = path.resolve(__dirname, 'materials');
const REGISTRY_PATH = path.resolve(__dirname, 'content-registry.json');

// Registry is the single source of truth: contentId → relative path under public/
let registry;
try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    console.log(`Registry loaded: ${Object.keys(registry).length} content entries`);
} catch (err) {
    console.error('Cannot load content-registry.json:', err.message);
    process.exit(1);
}

// GET /content/:id
// Resolves an abstract content ID to a file and streams it.
// This is the only place where content file paths are used.
app.get('/content/:id', (req, res) => {
    const { id } = req.params;

    // IDs are lowercase alphanumeric + underscores only
    if (!/^[a-z0-9_]+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid content ID' });
    }

    const relativePath = registry[id];
    if (!relativePath) {
        return res.status(404).json({ error: `Unknown content ID: ${id}` });
    }

    const filePath = path.resolve(PUBLIC_DIR, relativePath);

    // Defense-in-depth: resolved path must stay inside PUBLIC_DIR
    if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    res.sendFile(filePath, (err) => {
        if (err && !res.headersSent) {
            res.status(500).json({ error: 'Failed to serve content' });
        }
    });
});

// Serve manifests and per-lab assets (images, etc.) from /materials
app.use('/materials', express.static(MATERIALS_DIR));

// Serve the built frontend in production
const distPath = path.resolve(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    if (!fs.existsSync(distPath)) {
        console.log('Dev mode: run "pnpm dev:client" for the Vite frontend');
    }
});
