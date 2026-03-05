export const LAB_CONFIG = {
    1: {
        theory: 'documentation/FirstLab/FirstLabTheory.html',
        example: {
            steps: [
                { counter: '1-ый шаг', header: 'Определение параметров и постановка задачи', path: 'documentation/FirstLab/FirstLab_Example1.html' },
                { counter: '2-ой шаг', header: 'Создание модели СМО на GPSS', path: 'documentation/FirstLab/FirstLab_Example2.html' },
                { counter: '3-ий шаг', header: 'Анализ результатов моделирования', path: 'documentation/FirstLab/FirstLab_Example3.html' },
            ],
        },
        tasks: { count: 19, path: 'documentation/FirstLab/FirstLabVariants.html' },
    },
    2: {
        theory: 'documentation/SecondLab/SecondLabTheory.html',
        example: {
            steps: [
                { counter: 'Часть 1', header: 'Разработка XML-документа для иерархической базы данных', path: 'documentation/SecondLab/SecondLab_Example1.html' },
                { counter: 'Часть 2', header: 'Изучение языка запросов XPath', path: 'documentation/SecondLab/SecondLab_Example2.html' },
            ],
        },
        tasks: { count: 30, path: 'documentation/SecondLab/SecondLabVariants.html' },
    },
    3: {
        theory: 'documentation/ThirdLab/ThirdLabTheory.html',
        example: {
            steps: [
                { counter: 'Пример №1', header: 'Парсинг списка тем с первой страницы форума CyberForum', path: 'documentation/ThirdLab/ThirdLab_Example1.html' },
                { counter: 'Пример №2', header: 'Парсинг данных с помощью Post/Get запросов без использования браузера', path: 'documentation/ThirdLab/ThirdLab_Example2.html' },
            ],
        },
        tasks: { path: 'documentation/ThirdLab/ThirdLabVariants.html' },
    },
    4: {
        theory: 'documentation/FourthLab/FourthLabTheory.html',
        example: {
            steps: [
                { counter: 'Часть №1', header: 'Создание топологии сети и настройка IP-адресов', path: 'documentation/FourthLab/FourthLabExample1.html' },
                { counter: 'Часть №2', header: 'Моделирование с использованием утилиты Ping и анализ сетевых протоколов', path: 'documentation/FourthLab/FourthLabExample2.html' },
            ],
        },
        tasks: { path: 'documentation/FourthLab/FourthLabVariants.html' },
    },
    5: {
        theory: 'documentation/FifthLab/FifthLabTheory.html',
        example: {
            steps: [
                { counter: 'Часть 1', header: 'Подготовка к созданию порта', path: 'documentation/FifthLab/FifthLab_Example1.html' },
                { counter: 'Часть 2', header: 'Настройка и моделирование', path: 'documentation/FifthLab/FifthLab_Example2.html' },
            ],
        },
        tasks: { count: 22, path: 'documentation/FifthLab/FifthLabVariants.html' },
    },
};

export const LABS_WITHOUT_VARIANTS = new Set(['3', '4']);