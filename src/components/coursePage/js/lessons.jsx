
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import javascriptCourse from './js.json'

function LessonsJS() {
    const { id } = useParams()
    const navigate = useNavigate()

    const lessons = javascriptCourse.lessons || []

    const lessonIndex = lessons.findIndex(
        item => String(item.id) === String(id)
    )

    const lesson = lessons[lessonIndex]
    const previousLesson = lessons[lessonIndex - 1]

    const isLocked = previousLesson &&
        localStorage.getItem(
            `js_lesson_${previousLesson.id}_completed`
        ) !== 'true'

    const [answers, setAnswers] = useState({})
    const [results, setResults] = useState({})
    const [completed, setCompleted] = useState(false)
    const [showHint, setShowHint] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!lesson) {
            navigate('/javascript')
            return
        }

        let savedResults = {}

        try {
            savedResults = JSON.parse(
                localStorage.getItem(`js_lesson_${id}_results`) || '{}'
            )
        } catch {
            savedResults = {}
        }

        setAnswers({})
        setResults(savedResults)
        setShowHint({})
        setErrors({})

        setCompleted(
            localStorage.getItem(`js_lesson_${id}_completed`) === 'true'
        )
    }, [id])

    if (!lesson) return null

    // Блокировка урока
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
                        onClick={() => navigate('/javascript')}
                        className="bg-blue-600 hover:bg-blue-500 cursor-pointer px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Вернуться к урокам
                    </button>
                </div>
            </div>
        )
    }

    const saveAnswer = (taskId, value) => {
        setAnswers(prev => ({
            ...prev,
            [taskId]: value
        }))

        setErrors(prev => ({
            ...prev,
            [taskId]: ''
        }))
    }

    // Проверка задания
    const checkTask = task => {
        const answer = answers[task.id]

        if (task.type === 'choice') {
            if (answer === undefined || answer === '') {
                setErrors(prev => ({
                    ...prev,
                    [task.id]: 'Выбери один ответ!'
                }))
                return
            }

            if (Number(answer) !== task.answer) {
                setErrors(prev => ({
                    ...prev,
                    [task.id]: 'Неправильный ответ. Попробуй ещё раз!'
                }))
                return
            }
        }

        if (task.type === 'code' || task.type === 'project') {
            if (!answer || !answer.trim()) {
                setErrors(prev => ({
                    ...prev,
                    [task.id]: 'Сначала напиши свой код!'
                }))
                return
            }

            const normalize = value =>
                value
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/;/g, '')

            const code = normalize(answer)

            const isCorrect = (task.checks || []).every(check =>
                code.includes(normalize(check))
            )

            if (!isCorrect) {
                setErrors(prev => ({
                    ...prev,
                    [task.id]: 'Код пока не соответствует заданию. Проверь его!'
                }))
                return
            }
        }

        const updatedResults = {
            ...results,
            [task.id]: true
        }

        setResults(updatedResults)

        localStorage.setItem(
            `js_lesson_${id}_results`,
            JSON.stringify(updatedResults)
        )

        setErrors(prev => ({
            ...prev,
            [task.id]: ''
        }))
    }

    const allTasksCompleted = lesson.tasks.every(
        task => results[task.id]
    )

    // Завершение урока
    const finishLesson = () => {
        if (!allTasksCompleted) return

        localStorage.setItem(
            `js_lesson_${id}_completed`,
            'true'
        )

        setCompleted(true)
    }

    // ВСЕГДА возвращаемся к списку JavaScript
    const backToLessons = () => {
        navigate('/javascript', { replace: true })
    }

    const completedCount = Object.values(results).filter(Boolean).length

    const progress = lesson.tasks.length
        ? (completedCount / lesson.tasks.length) * 100
        : 0

    return (
        <div className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 rounded-2xl border border-blue-900/50 bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-8">

                    <button
                        onClick={backToLessons}
                        className="mb-7 rounded-xl border border-blue-800 bg-blue-900/40 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-700 hover:text-white cursor-pointer"
                    >
                        ← Назад к курсу
                    </button>

                    <div className="mb-3 text-sm font-semibold text-blue-400">
                        JAVASCRIPT · УРОК {lessonIndex + 1} ИЗ {lessons.length}
                    </div>

                    <h1 className="mb-3 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>

                    <p className="mb-6 text-sm text-slate-400 sm:text-base">
                        {lesson.description}
                    </p>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                        Выполнено заданий: {completedCount} / {lesson.tasks.length}
                    </p>
                </div>

                {/* THEORY */}
                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">

                    <h2 className="mb-6 flex items-center gap-3 text-xl font-bold sm:text-2xl">
                        <span>📚</span> Теория
                    </h2>

                    <div className="space-y-4">
                        {lesson.theory.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-700/70 bg-slate-800/70 p-5 transition hover:border-blue-500/50"
                            >
                                <h3 className="mb-3 text-lg font-bold text-blue-400">
                                    {item.title}
                                </h3>

                                <p className="whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* EXAMPLE */}
                {lesson.example && (
                    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">

                        <h2 className="mb-5 flex items-center gap-3 text-xl font-bold sm:text-2xl">
                            <span>💻</span> Пример кода
                        </h2>

                        <pre className="overflow-x-auto rounded-xl border border-slate-700 bg-[#080e1b] p-5 text-sm leading-7 text-cyan-300">
                            <code>{lesson.example}</code>
                        </pre>
                    </section>
                )}

                {/* PRACTICE */}
                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">

                    <h2 className="mb-6 flex items-center gap-3 text-xl font-bold sm:text-2xl">
                        <span>🚀</span> Практика
                    </h2>

                    <div className="space-y-6">
                        {lesson.tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 transition hover:border-blue-500/50 sm:p-6"
                            >

                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="text-lg font-bold text-white">
                                        Задание {index + 1}: {task.title}
                                    </h3>

                                    {results[task.id] && (
                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                            ✓ Выполнено
                                        </span>
                                    )}
                                </div>

                                <p className="mb-5 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">
                                    {task.description}
                                </p>

                                {/* CHOICE */}
                                {task.type === 'choice' && (
                                    <div className="mb-5 flex flex-col gap-3">
                                        {task.options.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                onClick={() => saveAnswer(task.id, optionIndex)}
                                                disabled={results[task.id]}
                                                className={`w-full rounded-xl border p-4 text-left text-sm transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                                                    answers[task.id] === optionIndex
                                                        ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                                                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-blue-500 hover:bg-slate-700/70'
                                                }`}
                                            >
                                                <span className="mr-3 font-bold text-blue-400">
                                                    {String.fromCharCode(65 + optionIndex)}.
                                                </span>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* CODE / PROJECT */}
                                {(task.type === 'code' || task.type === 'project') && (
                                    <div className="mb-5">

                                        <div className="mb-3 flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-300">
                                                Твой JavaScript код
                                            </label>

                                            <span className="rounded-md bg-slate-900 px-3 py-1 text-xs text-blue-400">
                                                JavaScript
                                            </span>
                                        </div>

                                        <textarea
                                            value={answers[task.id] || ''}
                                            onChange={e => saveAnswer(task.id, e.target.value)}
                                            disabled={results[task.id]}
                                            placeholder="Напиши свой JavaScript код..."
                                            rows={8}
                                            spellCheck={false}
                                            className="w-full resize-y rounded-xl border border-slate-700 bg-[#080e1b] p-5 font-mono text-sm leading-7 text-cyan-300 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-60"
                                        />
                                    </div>
                                )}

                                {/* ERROR */}
                                {errors[task.id] && (
                                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                                        <span>⚠️</span>
                                        <p>{errors[task.id]}</p>
                                    </div>
                                )}

                                {/* HINT */}
                                {showHint[task.id] && (
                                    <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-300">
                                        💡 {task.hint || 'Попробуй ещё раз и внимательно прочитай условие.'}
                                    </div>
                                )}

                                {/* ACTIONS */}
                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <button
                                        onClick={() => setShowHint(prev => ({
                                            ...prev,
                                            [task.id]: !prev[task.id]
                                        }))}
                                        className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/20 cursor-pointer"
                                    >
                                        💡 Подсказка
                                    </button>

                                    <button
                                        onClick={() => checkTask(task)}
                                        disabled={results[task.id]}
                                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 cursor-pointer"
                                    >
                                        {results[task.id] ? '✓ Выполнено' : 'Проверить ответ'}
                                    </button>
                                </div>

                                {/* SUCCESS */}
                                {results[task.id] && (
                                    <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">
                                        ✓ Отлично! Задание выполнено.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center sm:p-8">

                    <div className="mb-5 flex flex-wrap items-center justify-center gap-3">

                        <span className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300">
                            Выполнено: <strong className="text-white">
                                {completedCount} / {lesson.tasks.length}
                            </strong>
                        </span>

                        <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-bold text-yellow-400">
                            🏆 {lesson.exp} EXP
                        </span>
                    </div>

                    {!completed && (
                        <button
                            onClick={finishLesson}
                            disabled={!allTasksCompleted}
                            className="w-full max-w-sm rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
                        >
                            Завершить урок
                        </button>
                    )}

                    {completed && (
                        <button
                            onClick={backToLessons}
                            className="w-full max-w-sm rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-7 py-4 font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:from-emerald-500 hover:to-green-400 cursor-pointer"
                        >
                            Вернуться к урокам ✓
                        </button>
                    )}

                    {!allTasksCompleted && !completed && (
                        <p className="mt-4 text-sm text-slate-500">
                            Выполни все задания, чтобы завершить урок.
                        </p>
                    )}
                </section>
            </div>
        </div>
    )
}

export default LessonsJS
