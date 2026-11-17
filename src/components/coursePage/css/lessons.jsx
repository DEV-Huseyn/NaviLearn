
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import cssCourse from './css.json'

function checkCSS(code, checks = []) {
    if (!Array.isArray(checks) || checks.length === 0) return false

    const normalizedCode = code
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()

    return checks.every(check => {
        if (typeof check !== 'string') return false

        const normalizedCheck = check
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()

        return normalizedCode.includes(normalizedCheck)
    })
}

function Lessons() {
    const { id } = useParams()
    const navigate = useNavigate()

    const lessons = cssCourse.lessons || []

    const lessonIndex = lessons.findIndex(
        item => String(item.id) === String(id)
    )

    const lesson = lessons[lessonIndex]
    const previousLesson = lessons[lessonIndex - 1]
    const nextLesson = lessons[lessonIndex + 1]

    const tasks = lesson?.tasks || []
    const storageKey = `navilearn-css-${id}`

    const [taskIndex, setTaskIndex] = useState(0)
    const [code, setCode] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)
    const [completedTasks, setCompletedTasks] = useState([])
    const [isCorrect, setIsCorrect] = useState(false)
    const [showError, setShowError] = useState(false)

    const task = tasks[taskIndex]

    // Загружаем прогресс при открытии урока
    useEffect(() => {
        if (!lesson) return

        let savedTasks = []

        try {
            savedTasks = JSON.parse(
                localStorage.getItem(`${storageKey}-tasks`) || '[]'
            )

            if (!Array.isArray(savedTasks)) {
                savedTasks = []
            }
        } catch {
            savedTasks = []
        }

        setCompletedTasks(savedTasks)
        setTaskIndex(0)
        setIsCorrect(false)
        setShowError(false)
    }, [id])

    // Загружаем сохранённый код и ответ задания
    useEffect(() => {
        if (!task) return

        const savedCode = localStorage.getItem(
            `${storageKey}-${task.id}-code`
        )

        const savedOption = localStorage.getItem(
            `${storageKey}-${task.id}-option`
        )

        setCode(savedCode ?? task.initialCode ?? '')

        setSelectedOption(
            savedOption !== null ? Number(savedOption) : null
        )

        setIsCorrect(completedTasks.includes(task.id))
        setShowError(false)
    }, [taskIndex, id, completedTasks])

    // Урок не найден
    if (!lesson) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Урок не найден
                    </h2>

                    <button
                        onClick={() => navigate('/css')}
                        className="bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 py-3 rounded-xl"
                    >
                        Назад к курсу
                    </button>
                </div>
            </div>
        )
    }

    // Проверяем, завершён ли предыдущий урок
    const isLocked =
        previousLesson &&
        localStorage.getItem(
            `navilearn-css-${previousLesson.id}`
        ) !== 'true'

if (isLocked) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">

                <h2 className="text-2xl font-bold mb-4">
                    🔒 Урок закрыт
                </h2>

                <p className="text-gray-400 mb-6">
                    Сначала пройди предыдущий урок!
                </p>

                <button
                    onClick={() => navigate('/css')}
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 py-3 rounded-xl font-semibold transition"
                >
                    Вернуться к урокам
                </button>

            </div>
        </div>
    )
}

    // Сохраняем CSS-код
    const saveCode = value => {
        setCode(value)

        if (task) {
            localStorage.setItem(
                `${storageKey}-${task.id}-code`,
                value
            )
        }
    }

    // Сохраняем выбранный вариант ответа
    const selectOption = index => {
        if (!task || completedTasks.includes(task.id)) return

        setSelectedOption(index)

        localStorage.setItem(
            `${storageKey}-${task.id}-option`,
            String(index)
        )

        setIsCorrect(false)
        setShowError(false)
    }

    // Сохраняем выполненное задание
    const completeTask = () => {
        if (!task) return

        const updatedTasks = completedTasks.includes(task.id)
            ? completedTasks
            : [...completedTasks, task.id]

        setCompletedTasks(updatedTasks)

        localStorage.setItem(
            `${storageKey}-tasks`,
            JSON.stringify(updatedTasks)
        )

        setIsCorrect(true)
        setShowError(false)
    }

    // Проверяем задание
    const checkTask = () => {
        if (!task) return

        let result = false

        if (task.type === 'choice') {
            result = selectedOption === task.answer
        }

        if (task.type === 'code') {
            result = checkCSS(code, task.checks)
        }

        if (!result) {
            setIsCorrect(false)
            setShowError(true)
            return
        }

        completeTask()
    }

    // Проверяем выполнение всех заданий
    const allTasksCompleted =
        tasks.length > 0 &&
        tasks.every(item => completedTasks.includes(item.id))

    // Переход к следующему заданию или уроку
    const handleNext = () => {
        if (!isCorrect || !task) return

        // Если есть следующее задание в этом уроке
        if (taskIndex < tasks.length - 1) {
            setTaskIndex(prev => prev + 1)
            return
        }

        // Последнее задание: проверяем весь урок
        if (!allTasksCompleted) return

        // Отмечаем урок завершённым
        localStorage.setItem(storageKey, 'true')

        // Переходим к следующему уроку
        if (nextLesson) {
            navigate(`/css`)
        } else {
            // Если это последний урок курса
            navigate('/course')
        }
    }

    // HTML для предпросмотра CSS
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CSS Preview</title>
        </head>
        <body>
            <h1>Моя первая CSS-страница</h1>
            <p>Здесь появится результат твоего CSS-кода.</p>
            <button>Нажми меня</button>
            <div class="card">Моя карточка</div>
            <div class="container">
                <div class="box">1</div>
                <div class="box">2</div>
                <div class="box">3</div>
            </div>
        </body>
        </html>
    `

    const preview = htmlTemplate.replace(
        '</head>',
        `<style>${code}</style></head>`
    )

    // Прогресс
    const progress = tasks.length
        ? Math.round(
            (completedTasks.length / tasks.length) * 100
        )
        : 0

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Назад к курсу */}
                <button
                    onClick={() => navigate('/css')}
                    className="text-blue-400 hover:text-blue-300 cursor-pointer mb-6"
                >
                    ← Назад к курсу
                </button>

                {/* Заголовок урока */}
                <div className="mb-8">
                    <p className="text-blue-400 text-sm mb-2">
                        CSS · Урок {lessonIndex + 1} из {lessons.length}
                    </p>

                    <h1 className="text-3xl font-bold mb-3">
                        {lesson.title}
                    </h1>

                    <p className="text-gray-400">
                        {lesson.description}
                    </p>

                    {/* Прогресс */}
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-5 overflow-hidden">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-gray-400 text-sm mt-2">
                        Выполнено заданий: {completedTasks.length} из {tasks.length}
                    </p>
                </div>

                {/* Теория */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-5">
                        Теория
                    </h2>

                    <div className="space-y-5">
                        {lesson.theory?.map((item, index) => (
                            <div key={index}>
                                <h3 className="text-blue-400 font-semibold mb-2">
                                    {item.title}
                                </h3>

                                <p className="text-gray-300 leading-7">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Пример */}
                {lesson.example && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-blue-400">
                            Пример кода
                        </h2>

                        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-sm text-blue-300 whitespace-pre-wrap">
                            <code>{lesson.example}</code>
                        </pre>
                    </section>
                )}

                {/* Практика */}
                {task ? (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="flex flex-wrap justify-between gap-3 mb-5">
                            <h2 className="text-xl font-bold text-blue-400">
                                Практика
                            </h2>

                            <span className="text-sm text-gray-400">
                                Задание {taskIndex + 1} из {tasks.length}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            {task.title}
                        </h3>

                        <p className="text-gray-300 mb-5 whitespace-pre-line">
                            {task.description}
                        </p>

                        {/* Варианты ответа */}
                        {task.type === 'choice' && (
                            <div className="space-y-3 mb-6">
                                {task.options?.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => selectOption(index)}
                                        disabled={completedTasks.includes(task.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition cursor-pointer
                                            ${selectedOption === index
                                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                                : 'bg-slate-950 border-slate-700 hover:border-blue-500 text-gray-300'
                                            }
                                            disabled:cursor-not-allowed
                                        `}
                                    >
                                        <span className="mr-3 text-blue-400">
                                            {String.fromCharCode(65 + index)}.
                                        </span>

                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* CSS-редактор */}
                        {task.type === 'code' && (
                            <>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="font-semibold text-sm">
                                            Твой CSS-код
                                        </label>

                                        <span className="text-gray-500 text-xs">
                                            CSS Editor
                                        </span>
                                    </div>

                                    <textarea
                                        value={code}
                                        onChange={e => saveCode(e.target.value)}
                                        placeholder="Напиши свой CSS-код здесь..."
                                        spellCheck={false}
                                        disabled={completedTasks.includes(task.id)}
                                        className="w-full min-h-[250px] resize-y bg-[#080d18] border border-slate-700 rounded-xl p-4 text-blue-300 font-mono text-sm outline-none focus:border-blue-500 disabled:opacity-70"
                                    />
                                </div>

                                {/* Предпросмотр */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">
                                        Предпросмотр
                                    </h3>

                                    <iframe
                                        title="CSS Preview"
                                        srcDoc={preview}
                                        sandbox=""
                                        className="w-full h-[300px] bg-white rounded-xl border border-slate-700"
                                    />
                                </div>
                            </>
                        )}

                        {/* Подсказка */}
                        {task.hint && (
                            <details className="mb-5 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <summary className="text-blue-400 cursor-pointer font-semibold">
                                    Подсказка
                                </summary>

                                <p className="text-gray-300 mt-3">
                                    {task.hint}
                                </p>
                            </details>
                        )}

                        {/* Ошибка */}
                        {showError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-4">
                                Пока неправильно. Проверь ответ и попробуй ещё раз.
                            </div>
                        )}

                        {/* Успех */}
                        {isCorrect && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-4">
                                Отлично! Задание выполнено.
                            </div>
                        )}

                        {/* Кнопки */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {!completedTasks.includes(task.id) && (
                                <button
                                    onClick={checkTask}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer py-3 rounded-xl font-semibold transition"
                                >
                                    Проверить
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={!isCorrect}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer py-3 rounded-xl font-semibold transition"
                            >
                                {taskIndex === tasks.length - 1
                                    ? 'Завершить урок'
                                    : 'Следующее задание →'
                                }
                            </button>
                        </div>

                        {/* Завершение */}
                        {allTasksCompleted && (
                            <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                <p className="text-emerald-400 font-semibold">
                                    Все задания этого урока выполнены!
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    Нажми «Завершить урок», чтобы продолжить обучение.
                                </p>
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        В этом уроке пока нет заданий.
                    </div>
                )}

            </div>
        </div>
    )
}

export default Lessons
