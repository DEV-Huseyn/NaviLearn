
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

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        🔒 Урок закрыт
                    </h1>

                    <p className="text-gray-400 mb-4">
                        Сначала пройди предыдущий урок!
                    </p>

                    <button
                        onClick={() => navigate('/javascript')}
                        className="rounded-xl bg-blue-600 p-3 text-white font-bold cursor-pointer hover:bg-blue-500 transition"
                    >
                        Вернуться к урокам
                    </button>
                </div>
            </div>
        )
    }

    // Сохранение ответа
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

    // Нормализация кода
    const normalizeCode = value => {
        return value
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/;/g, '')
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

            if (Number(answer) !== Number(task.answer)) {
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

            const code = normalizeCode(answer)

            const isCorrect = (task.checks || []).every(check => {
                const normalizedCheck = normalizeCode(check)

                if (normalizedCheck === 'leta=20') {
                    return /(?:^|[^a-z0-9_$])(?:let|const|var)?a=20/.test(code)
                }

                if (normalizedCheck === 'letb=5') {
                    return /(?:^|[^a-z0-9_$])(?:let|const|var)?b=5/.test(code)
                }

                return code.includes(normalizedCheck)
            })

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

    // Проверка выполнения всех заданий
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

    const backToLessons = () => {
        navigate('/javascript', { replace: true })
    }

    const completedCount = Object.values(results).filter(Boolean).length

    const progress = lesson.tasks.length
        ? (completedCount / lesson.tasks.length) * 100
        : 0

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
            <div className="mx-auto max-w-4xl">

                {/* HEADER */}
                <button
                    className="text-blue-400 hover:text-blue-300 cursor-pointer transition mb-6"
                    onClick={backToLessons}
                >
                    ← Все уроки
                </button>

                <h1 className="my-6 text-3xl font-bold">
                    {lesson.title}
                </h1>

                <p className="mb-6 text-gray-400">
                    {lesson.description}
                </p>

                {/* PROGRESS */}
                <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex justify-between mb-3 text-sm text-slate-400">
                        <span>Прогресс урока</span>
                        <span>{completedCount} / {lesson.tasks.length}</span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* THEORY */}
                <h2 className="mb-4 text-xl font-bold text-blue-400">
                    Теория
                </h2>

                <div className="space-y-4">
                    {lesson.theory.map((item, index) => (
                        <div
                            key={index}
                            className="mb-4 rounded-xl bg-slate-900 border border-slate-800 p-4"
                        >
                            <h3 className="mb-2 font-bold">
                                {item.title}
                            </h3>

                            <p className="whitespace-pre-line text-gray-300 leading-7">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* EXAMPLE */}
                {lesson.example && (
                    <>
                        <h2 className="mb-4 mt-8 text-xl font-bold text-blue-400">
                            Пример
                        </h2>

                        <pre className="overflow-x-auto rounded-xl bg-slate-900 border border-slate-800 p-4 text-blue-300">
                            <code>{lesson.example}</code>
                        </pre>
                    </>
                )}

                {/* PRACTICE */}
                <h2 className="mb-4 mt-8 text-xl font-bold text-blue-400">
                    Практика
                </h2>

                {lesson.tasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="mb-5 rounded-xl bg-slate-900 border border-slate-800 p-5"
                    >
                        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                            <h3 className="font-bold">
                                Задание {index + 1}: {task.title}
                            </h3>

                            {results[task.id] && (
                                <span className="text-sm text-emerald-400">
                                    ✓ Выполнено
                                </span>
                            )}
                        </div>

                        <p className="mb-4 text-gray-300 whitespace-pre-line">
                            {task.description}
                        </p>

                        {/* CHOICE */}
                        {task.type === 'choice' && (
                            <div className="space-y-2 mb-4">
                                {task.options.map((option, optionIndex) => (
                                    <button
                                        key={optionIndex}
                                        onClick={() => saveAnswer(task.id, optionIndex)}
                                        disabled={results[task.id]}
                                        className={`block w-full rounded-lg p-3 text-left border transition cursor-pointer ${
                                            answers[task.id] === optionIndex
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : 'bg-slate-950 border-slate-700 hover:border-blue-500 text-gray-300'
                                        } disabled:opacity-50`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* CODE / PROJECT */}
                        {(task.type === 'code' || task.type === 'project') && (
                            <textarea
                                value={answers[task.id] || ''}
                                onChange={e => saveAnswer(task.id, e.target.value)}
                                disabled={results[task.id]}
                                placeholder="Напиши свой JavaScript код..."
                                rows={6}
                                spellCheck={false}
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 p-4 font-mono text-blue-300 outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                        )}

                        {/* ERROR */}
                        {errors[task.id] && (
                            <p className="mt-3 text-sm text-red-400">
                                ⚠️ {errors[task.id]}
                            </p>
                        )}

                        {/* HINT */}
                        {showHint[task.id] && (
                            <p className="mt-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 text-sm text-yellow-300">
                                💡 {task.hint || 'Попробуй ещё раз и внимательно прочитай условие.'}
                            </p>
                        )}

                        {/* ACTIONS */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                onClick={() => setShowHint(prev => ({
                                    ...prev,
                                    [task.id]: !prev[task.id]
                                }))}
                                className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-500/20 cursor-pointer transition"
                            >
                                💡 Подсказка
                            </button>

                            <button
                                onClick={() => checkTask(task)}
                                disabled={results[task.id]}
                                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 font-bold text-white transition disabled:opacity-40 cursor-pointer"
                            >
                                {results[task.id] ? '✓ Выполнено' : 'Проверить ответ'}
                            </button>
                        </div>

                        {/* SUCCESS */}
                        {results[task.id] && (
                            <p className="mt-3 font-bold text-emerald-400">
                                ✓ Отлично! Задание выполнено.
                            </p>
                        )}
                    </div>
                ))}

                {/* FOOTER */}
                <div className="mt-6 rounded-xl bg-slate-900 border border-slate-800 p-5 text-center">

                    <h2 className="mb-3 text-xl font-bold">
                        Результат: {completedCount} из {lesson.tasks.length}
                    </h2>

                    <div className="mb-5 flex justify-center gap-3 flex-wrap">
                        <span className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300">
                            Выполнено: {completedCount} / {lesson.tasks.length}
                        </span>

                        <span className="rounded-xl bg-yellow-500/10 text-yellow-400 px-4 py-2">
                            🏆 {lesson.exp} EXP
                        </span>
                    </div>

                    {!completed && (
                        <button
                            onClick={finishLesson}
                            disabled={!allTasksCompleted}
                            className="w-full cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 p-4 font-bold text-white transition disabled:opacity-40"
                        >
                            Завершить урок
                        </button>
                    )}

                    {completed && (
                        <button
                            onClick={backToLessons}
                            className="w-full cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-500 p-4 font-bold text-white transition"
                        >
                            Вернуться к урокам ✓
                        </button>
                    )}

                    {!allTasksCompleted && !completed && (
                        <p className="mt-4 text-sm text-slate-500">
                            Выполни все задания, чтобы завершить урок.
                        </p>
                    )}

                </div>

            </div>
        </div>
    )
}

export default LessonsJS
