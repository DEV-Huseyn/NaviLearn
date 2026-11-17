
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import cssCourse from './css.json'

function checkCSS(code, checks = []) {
    if (!checks.length) return false

    return checks.every((check) => {
        const selector = check.selector || check.target || ''
        const property = check.property || check.name || ''
        const value = check.value || ''

        switch (check.type) {
            case 'declaration': {
                const escapedProperty = property.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                )

                const pattern = new RegExp(
                    `${escapedProperty}\\s*:\\s*${value ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '[^;}]+'}`,
                    'i'
                )

                if (selector) {
                    const blocks = code.match(/[^{}]+\{[^{}]*\}/g) || []

                    return blocks.some((block) => {
                        const blockSelector = block
                            .slice(0, block.indexOf('{'))
                            .trim()

                        return (
                            blockSelector.includes(selector) &&
                            pattern.test(block)
                        )
                    })
                }

                return pattern.test(code)
            }

            case 'mediaRuleExists': {
                const media = check.media || check.query || value
                return new RegExp(
                    `@media\\s*${media.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                    'i'
                ).test(code)
            }

            case 'mediaDeclaration': {
                const media = check.media || check.query || ''
                const escapedProperty = property.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                )

                const mediaBlocks = code.match(/@media[^{]*\{(?:[^{}]*|\{[^{}]*\})*\}/gi) || []

                return mediaBlocks.some((block) => {
                    if (media && !block.includes(media)) return false

                    if (selector && !block.includes(selector)) return false

                    const declaration = new RegExp(
                        `${escapedProperty}\\s*:\\s*${value ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '[^;}]+'}`,
                        'i'
                    )

                    return declaration.test(block)
                })
            }

            case 'variableExists': {
                const variable = check.variable || check.name || value
                return new RegExp(
                    `--${variable.replace(/^--/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`,
                    'i'
                ).test(code)
            }

            default:
                return false
        }
    })
}

function Lessons() {
    const { id } = useParams()
    const navigate = useNavigate()

    const course = cssCourse.course

    const lessons = useMemo(
        () => course.modules.flatMap((module) => module.lessons),
        []
    )

    const lessonIndex = lessons.findIndex(
        (item) => String(item.id) === String(id)
    )

    const lesson = lessons[lessonIndex]

    const [taskIndex, setTaskIndex] = useState(0)
    const [code, setCode] = useState('')
    const [completedTasks, setCompletedTasks] = useState([])
    const [isCorrect, setIsCorrect] = useState(false)
    const [showError, setShowError] = useState(false)

    const storageKey = `navilearn-css-${id}`
    const task = lesson?.tasks?.[taskIndex]

    useEffect(() => {
        if (!lesson) return

        setTaskIndex(0)
        setIsCorrect(false)
        setShowError(false)

        const savedTasks = JSON.parse(
            localStorage.getItem(`${storageKey}-tasks`) || '[]'
        )

        setCompletedTasks(savedTasks)

        const firstTask = lesson.tasks?.[0]

        setCode(
            firstTask
                ? localStorage.getItem(
                    `${storageKey}-${firstTask.id}-code`
                ) || firstTask.initialCode || ''
                : ''
        )
    }, [id])

    useEffect(() => {
        if (!task) return

        const savedCode = localStorage.getItem(
            `${storageKey}-${task.id}-code`
        )

        setCode(savedCode ?? task.initialCode ?? '')
        setIsCorrect(completedTasks.includes(task.id))
        setShowError(false)
    }, [taskIndex, id])

    if (!lesson) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
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

    const previousLesson = lessons[lessonIndex - 1]

    const isLocked =
        previousLesson &&
        localStorage.getItem(
            `navilearn-css-${previousLesson.id}`
        ) !== 'true'

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-3">
                    Урок заблокирован
                </h2>

                <p className="text-gray-400 mb-5">
                    Сначала заверши предыдущий урок.
                </p>

                <button
                    onClick={() => navigate('/css')}
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 py-3 rounded-xl"
                >
                    Назад к курсу
                </button>
            </div>
        )
    }

    const saveCode = (value) => {
        setCode(value)

        localStorage.setItem(
            `${storageKey}-${task.id}-code`,
            value
        )
    }

    const checkTask = () => {
        if (!task) return

        const result = checkCSS(code, task.checks)

        if (!result) {
            setIsCorrect(false)
            setShowError(true)
            return
        }

        setIsCorrect(true)
        setShowError(false)

        const updatedTasks = completedTasks.includes(task.id)
            ? completedTasks
            : [...completedTasks, task.id]

        setCompletedTasks(updatedTasks)

        localStorage.setItem(
            `${storageKey}-tasks`,
            JSON.stringify(updatedTasks)
        )
    }

    const nextTask = () => {
        if (!isCorrect) return

        if (taskIndex < lesson.tasks.length - 1) {
            const nextIndex = taskIndex + 1
            const next = lesson.tasks[nextIndex]

            setTaskIndex(nextIndex)
            setCode(
                localStorage.getItem(
                    `${storageKey}-${next.id}-code`
                ) || next.initialCode || ''
            )

            setIsCorrect(completedTasks.includes(next.id))
            setShowError(false)

            return
        }

        const allTasksCompleted = lesson.tasks.every(
            (item) => completedTasks.includes(item.id)
        )

        if (!allTasksCompleted) return

        localStorage.setItem(storageKey, 'true')

    }

    const htmlTemplate = lesson.htmlTemplate || `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>CSS Preview</title>
        </head>
        <body>
            <h1>Моя первая CSS-страница</h1>
            <p>Здесь появится результат твоего CSS-кода.</p>
            <button>Нажми меня</button>
        </body>
        </html>
    `

    const preview = htmlTemplate.replace(
        /<\/head>/i,
        `<style>${code}</style></head>`
    )

    const progress = lesson.tasks.length
        ? Math.round(
            (completedTasks.length / lesson.tasks.length) * 100
        )
        : 0

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                <button
                    onClick={() => navigate('/css')}
                    className="text-blue-400 hover:text-blue-300 cursor-pointer mb-6"
                >
                    ← Назад к курсу
                </button>

                {/* Заголовок */}

                <div className="mb-8">
                    <p className="text-blue-400 text-sm mb-2">
                        CSS · Урок {lessonIndex + 1} из {lessons.length}
                    </p>

                    <h1 className="text-3xl font-bold mb-3">
                        {lesson.title}
                    </h1>

                    <div className="w-full bg-slate-800 rounded-full h-2 mt-5">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-gray-400 text-sm mt-2">
                        Выполнено заданий: {completedTasks.length} из {lesson.tasks.length}
                    </p>
                </div>

                {/* Теория */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        Теория
                    </h2>

                    <p className="text-gray-300 whitespace-pre-line leading-7">
                        {lesson.theory}
                    </p>
                </section>

                {/* Пример */}

                {lesson.example && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-blue-400">
                            Пример
                        </h2>

                        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-sm text-blue-300 whitespace-pre-wrap">
                            {lesson.example}
                        </pre>
                    </section>
                )}

                {/* Практика */}

                {task && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="flex flex-wrap justify-between gap-3 mb-5">
                            <h2 className="text-xl font-bold text-blue-400">
                                Практика
                            </h2>

                            <span className="text-sm text-gray-400">
                                Задание {taskIndex + 1} из {lesson.tasks.length}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            {task.title}
                        </h3>

                        <p className="text-gray-300 mb-5 whitespace-pre-line">
                            {task.description}
                        </p>

                        {/* Редактор */}

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
                                onChange={(e) => saveCode(e.target.value)}
                                placeholder="Напиши свой CSS-код здесь..."
                                spellCheck={false}
                                className="w-full min-h-[250px] resize-y bg-[#080d18] border border-slate-700 rounded-xl p-4 text-blue-300 font-mono text-sm outline-none focus:border-blue-500"
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

                        {/* Проверка */}

                        {showError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-4">
                                Пока неправильно. Проверь CSS-код и попробуй ещё раз.
                            </div>
                        )}

                        {isCorrect && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-4">
                                Отлично! Задание выполнено.
                                {task.xpReward ? ` Награда: ${task.xpReward} XP.` : ''}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={checkTask}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer py-3 rounded-xl font-semibold transition"
                            >
                                Проверить
                            </button>

                            <button
                                onClick={nextTask}
                                disabled={!isCorrect}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer py-3 rounded-xl font-semibold transition"
                            >
                                {taskIndex === lesson.tasks.length - 1
                                    ? 'Завершить урок'
                                    : 'Следующее задание →'}
                            </button>
                        </div>
                    </section>
                )}

            </div>
        </div>
    )
}

export default Lessons
