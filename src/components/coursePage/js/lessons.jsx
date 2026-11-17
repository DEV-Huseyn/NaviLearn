
import React from 'react'
import { useNavigate, useParams } from 'react-router'

const Lessons = ({ course }) => {

    const navigate = useNavigate()
    const { id } = useParams()

    const allLessons = course.modules.flatMap(module =>
        module.lessons.map(lesson => ({
            ...lesson,
            moduleTitle: module.title
        }))
    )

    const lesson = allLessons.find(item => item.id === id)

    const coursePaths = {
        'html-beginner': '/html',
        'css-beginner': '/css',
        'js-beginner': '/js'
    }

    const coursePath = coursePaths[course.id] || '/course'

    if (!lesson) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">
                    Урок не найден
                </h1>

                <button
                    onClick={() => navigate(coursePath)}
                    className="text-yellow-400"
                >
                    Вернуться назад
                </button>
            </div>
        )
    }

    const currentIndex = allLessons.findIndex(
        item => item.id === id
    )

    const previousLesson = allLessons[currentIndex - 1]
    const nextLesson = allLessons[currentIndex + 1]

    const isJS = course.id === 'js-beginner'
    const isCSS = course.id === 'css-beginner'

    const color = isJS
        ? 'yellow'
        : isCSS
            ? 'blue'
            : 'emerald'

    const colors = {
        yellow: {
            text: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            button: 'bg-yellow-500 hover:bg-yellow-400 text-black'
        },
        blue: {
            text: 'text-blue-400',
            bg: 'bg-blue-500/10',
            button: 'bg-blue-600 hover:bg-blue-500 text-white'
        },
        emerald: {
            text: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            button: 'bg-emerald-600 hover:bg-emerald-500 text-white'
        }
    }

    const theme = colors[color]

    return (
        <div className="min-h-screen bg-slate-950 text-white p-5 sm:p-8">

            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => navigate(coursePath)}
                    className={`${theme.text} hover:opacity-80 mb-8`}
                >
                    ← К списку уроков
                </button>

                <div className="mb-8">

                    <p className={`${theme.text} text-sm mb-2`}>
                        {lesson.moduleTitle}
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold">
                        {lesson.title}
                    </h1>

                </div>

                {/* Theory */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 mb-6">

                    <h2 className={`text-xl font-bold mb-5 ${theme.text}`}>
                        Теория
                    </h2>

                    <p className="text-slate-300 leading-8 whitespace-pre-wrap">
                        {lesson.theory}
                    </p>

                </section>

                {/* Practice */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7">

                    <h2 className="text-xl font-bold mb-4 text-emerald-400">
                        Практика
                    </h2>

                    <p className="text-slate-400 mb-5">
                        {lesson.practice.description}
                    </p>

                    <div className="bg-slate-800 rounded-xl p-5">

                        <h3 className="font-semibold mb-3">
                            Твоё задание:
                        </h3>

                        <p className="text-slate-300 leading-7">
                            {lesson.practice.task}
                        </p>

                    </div>

                    <div className="mt-5 flex justify-between items-center">

                        <span className="text-emerald-400 font-semibold">
                            +10 XP
                        </span>

                    </div>

                </section>

                {/* Navigation */}
                <div className="flex justify-between gap-4 mt-8">

                    {previousLesson ? (
                        <button
                            onClick={() =>
                                navigate(
                                    `${coursePath}/lesson/${previousLesson.id}`
                                )
                            }
                            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700"
                        >
                            ← Предыдущий
                        </button>
                    ) : (
                        <div />
                    )}

                    {nextLesson && (
                        <button
                            onClick={() =>
                                navigate(
                                    `${coursePath}/lesson/${nextLesson.id}`
                                )
                            }
                            className={`px-5 py-3 rounded-xl transition ${theme.button}`}
                        >
                            Следующий →
                        </button>
                    )}

                </div>

            </div>

        </div>
    )
}

export default Lessons
