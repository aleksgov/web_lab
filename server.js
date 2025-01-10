const express = require("express");
const path = require("path");
const opn = require("opn");
const app = express();

function getDirPath() {
    // noinspection JSUnresolvedVariable
    if (process.pkg) {
        return path.resolve(process.execPath, "..");
    } else {
        return path.join(require.main ? require.main.path : process.cwd());
    }
}

const dirPath = getDirPath();

// Статические файлы
app.use(express.static(path.join(dirPath, "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(dirPath, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    opn(`http://localhost:${PORT}`).catch(err => {
        console.error("Ошибка при открытии браузера:", err);
    });
});
