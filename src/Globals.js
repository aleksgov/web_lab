// Globals.js

export const labFiles = {
    1: {
        theory: 'documentation/FirstLab/FirstLabTheory.html',
        example: {
            steps_count: 3,
            steps_counters: ["1-ый шаг", "2-ой шаг", "3-ий шаг"],
            steps_headers: ["Определение параметров и постановка задачи",
                            "Создание модели СМО на GPSS",
                            "Анализ результатов моделирования"],
            steps_paths: [
                'documentation/FirstLab/FirstLab_Example1.html',
                'documentation/FirstLab/FirstLab_Example2.html',
                'documentation/FirstLab/FirstLab_Example3.html'
            ]
        },
        tasks: {
            count: 19,
            path: 'documentation/FirstLab/FirstLabVariants.html'
        }
    },
    2: {
        theory: 'documentation/SecondLab/SecondLabTheory.html',
        example: {
            steps_count: 2,
            steps_counters: ["Часть 1", "Часть 2"],
            steps_headers: ["Разработка XML-документа для иерархической базы данных",
                "Изучение языка запросов XPath"],
            steps_paths: [
                'documentation/SecondLab/SecondLab_Example1.html',
                'documentation/SecondLab/SecondLab_Example2.html'
            ]
        },
        tasks: {
            count: 30,
            path: 'documentation/SecondLab/SecondLabVariants.html'
        }
    },
    3: {
        theory: 'documentation/ThirdLab/ThirdLabTheory.html',
        example: {
            steps_count: 2,
            steps_counters: ["Пример №1", "Пример №2"],
            steps_headers: ["Парсинг списка тем с первой страницы форума CyberForum",
                "Парсинг данных с помощью Post/Get запросов без использования браузера"],
            steps_paths: [
                'documentation/ThirdLab/ThirdLab_Example1.html',
                'documentation/ThirdLab/ThirdLab_Example2.html',
            ]
        },
        tasks: {
            path: 'documentation/ThirdLab/ThirdLabVariants.html'
        }
    },
    4: {
        theory: 'documentation/FourthLab/FourthLabTheory.html',
        example: {
            steps_count: 2,
            steps_counters: ["Часть №1", "Часть №2"],
            steps_headers: ['Создание топологии сети и настройка IP-адресов',
                'Моделирование с использованием утилиты Ping и анализ сетевых протоколов'],
            steps_paths: [
                '/documentation/FourthLab/FourthLabExample1.html',
                '/documentation/FourthLab/FourthLabExample2.html',
            ]
        },
        tasks: {
            path: 'documentation/FourthLab/FourthLabVariants.html'
        }
    },
    5: {
        theory: 'documentation/FifthLab/FifthLabTheory.html',
        example: {
            steps_count: 2,
            steps_counters: ["Часть 1", "Часть 2"],
            steps_headers: ["Подготовка к созданию порта",
                "Настройка и моделирование"],
            steps_paths: ['documentation/FifthLab/FifthLab_Example1.html',
                'documentation/FifthLab/FifthLab_Example2.html']
        },
        tasks: {
            count: 22,
            path: 'documentation/FifthLab/FifthLabVariants.html'
        }
    },
};
