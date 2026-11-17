
import React from 'react'
import { useNavigate } from 'react-router'
import jsCourse from './js.json'

const Javascript = () => {
    const navigate = useNavigate()

    const lessons = jsCourse.modules.flatMap(
        module => module.lessons
    )

    const isCompleted = (id) => {
        return localStorage.getItem(`js_lesson_${id}_completed`) === 'true'
    }

    const isUnlocked = (index) => {
        if (index === 0) return true

        return isCompleted(lessons[index - 1].id)
    }

    const completedCount = lessons.filter(
        lesson => isCompleted(lesson.id)
    ).length

    return (
        <div className="min-h-screen bg-slate-950 text-white p-5 sm:p-8">

            <div className="max-w-5xl mx-auto">

                <button
                    onClick={() => navigate('/course')}
                    className="cursor-pointer text-yellow-400 hover:text-yellow-300 mb-6"
                >
                    ← Назад к курсам
                </button>

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-yellow-400">
                        {jsCourse.title}
                    </h1>

                    <p className="text-slate-400 mt-3">
                        {jsCourse.description}
                    </p>

                    <div className="flex gap-4 mt-5 flex-wrap">

                        <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-xl">
                            {jsCourse.modules.length} модулей
                        </span>

                        <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-xl">
                            {lessons.length} уроков
                        </span>

                        <span className="bg-green-500/10 text-green-400 px-4 py-2 rounded-xl">
                            {completedCount} / {lessons.length} завершено
                        </span>

                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
                        <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{
                                width: `${lessons.length
                                    ? (completedCount / lessons.length) * 100
                                    : 0}%`
                            }}
                        />
                    </div>

                </div>

                <div className="space-y-6">

                    {jsCourse.modules.map((module, index) => (

                        <div
                            key={module.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                        >

                            <h2 className="text-xl font-bold mb-4">

                                <span className="text-yellow-400 mr-2">
                                    {index + 1}.
                                </span>

                                {module.title}

                            </h2>

                            <div className="space-y-3">

                                {module.lessons.map((lesson) => {

                                    const globalIndex = lessons.findIndex(
                                        item => item.id === lesson.id
                                    )

                                    const completed = isCompleted(lesson.id)
                                    const unlocked = isUnlocked(globalIndex)

                                    return (

                                        <button
                                            key={lesson.id}
                                            disabled={!unlocked}
                                            onClick={() => {
                                                if (unlocked) {
                                                    navigate(`/javascript/lesson/${lesson.id}`)
                                                }
                                            }}
                                            className={`w-full text-left flex items-center justify-between gap-3 p-4 rounded-xl transition ${
                                                !unlocked
                                                    ? 'bg-slate-800/30 opacity-50 cursor-not-allowed'
                                                    : completed
                                                        ? 'bg-green-500/10 hover:bg-green-500/20 cursor-pointer'
                                                        : 'bg-slate-800/70 hover:bg-slate-700 cursor-pointer'
                                            }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                <span className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg ${
                                                    completed
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : unlocked
                                                            ? 'bg-yellow-500/10 text-yellow-400'
                                                            : 'bg-slate-700 text-slate-500'
                                                }`}>

                                                    {completed
                                                        ? '✓'
                                                        : globalIndex + 1}

                                                </span>

                                                <span className="font-medium">
                                                    {lesson.title}
                                                </span>

                                            </div>

                                            <span className={
                                                completed
                                                    ? 'text-green-400'
                                                    : unlocked
                                                        ? 'text-yellow-400'
                                                        : 'text-slate-500'
                                            }>

                                                {completed
                                                    ? '✓'
                                                    : unlocked
                                                        ? '→'
                                                        : '🔒'}

                                            </span>

                                        </button>

                                    )
                                })}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default Javascript
