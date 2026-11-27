
import React from 'react'
import { useNavigate } from 'react-router'
import javascriptCourse from './js.json'

const Javascript = () => {
    const navigate = useNavigate()

    const course = javascriptCourse
    const lessons = course.lessons || []

    const totalTasks = lessons.reduce(
        (total, lesson) => total + lesson.tasks.length,
        0
    )

    const totalXP = lessons.reduce(
        (total, lesson) => total + (lesson.exp || 0),
        0
    )

    return (
        <div className="min-h-screen bg-slate-950 text-white p-5 sm:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <button
                    onClick={() => navigate('/course')}
                    className="text-blue-400 cursor-pointer hover:text-blue-300 mb-6 transition"
                >
                    ← Назад к курсам
                </button>

                {/* Course info */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-blue-400">
                        {course.title || 'Курс JavaScript'}
                    </h1>

                    <p className="text-slate-400 mt-3">
                        {course.description}
                    </p>

                    <div className="flex gap-4 mt-5 flex-wrap">
                        <span className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl">
                            JavaScript
                        </span>

                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl">
                            {lessons.length} уроков
                        </span>

                        <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-xl">
                            {totalTasks} заданий
                        </span>

                        <span className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-xl">
                            🏆 {totalXP} EXP
                        </span>
                    </div>
                </div>

                {/* Lessons */}
                <div className="space-y-4">
                    {lessons.map((lesson, index) => {
                        const isCompleted =
                            localStorage.getItem(
                                `js_lesson_${lesson.id}_completed`
                            ) === 'true'

                        const previousLesson = lessons[index - 1]

                        const isLocked =
                            previousLesson &&
                            localStorage.getItem(
                                `js_lesson_${previousLesson.id}_completed`
                            ) !== 'true'

                        return (
                            <button
                                key={lesson.id}
                                onClick={() => {
                                    if (!isLocked) {
                                        navigate(`/javascript/lesson/${lesson.id}`)
                                    }
                                }}
                                disabled={!!isLocked}
                                className={`w-full text-left flex items-center justify-between gap-3 border p-4 rounded-xl transition ${
                                    isLocked
                                        ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-blue-500 cursor-pointer'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg ${
                                        isCompleted
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                        {isCompleted ? '✓' : index + 1}
                                    </span>

                                    <div>
                                        <p className="font-medium">
                                            {lesson.title}
                                        </p>

                                        <p className="text-sm text-slate-400 mt-1">
                                            {lesson.tasks.length} заданий · {lesson.exp || 0} EXP
                                        </p>
                                    </div>
                                </div>

                                <span className="text-blue-400">
                                    {isLocked ? '🔒' : '→'}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {lessons.length === 0 && (
                    <p className="text-slate-400 text-center py-10">
                        Уроки пока не добавлены.
                    </p>
                )}

            </div>
        </div>
    )
}

export default Javascript
