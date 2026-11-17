
import React from 'react'
import { useNavigate, useParams } from 'react-router'

const Lessons = ({ course }) => {

    const navigate = useNavigate()
    const { id } = useParams()

    // Получаем все уроки из модулей
    const allLessons = course.modules.flatMap(module =>
        module.lessons.map(lesson => ({
            ...lesson,
            moduleTitle: module.title
        }))
    )

    // Находим выбранный урок
    const lesson = allLessons.find(item => item.id === id)

    if (!lesson) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">
                    Урок не найден
                </h1>

                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-400"
                >
                    Вернуться назад
                </button>
            </div>
        )
    }

    // Определяем предыдущий и следующий урок
    const currentIndex = allLessons.findIndex(
        item => item.id === id
    )

    const previousLesson = allLessons[currentIndex - 1]
    const nextLesson = allLessons[currentIndex + 1]

    return (
        <div className="min-h-screen bg-slate-950 text-white p-5 sm:p-8">

            <div className="max-w-4xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate(
                        course.id === 'css-beginner'
                            ? '/css'
                            : '/html'
                    )}
                    className="text-blue-400 hover:text-blue-300 mb-8"
                >
                    ← К списку уроков
                </button>

                {/* Lesson Header */}
                <div className="mb-8">

                    <p className="text-blue-400 text-sm mb-2">
                        {lesson.moduleTitle}
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold">
                        {lesson.title}
                    </h1>

                </div>

                {/* Theory */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 mb-6">

                    <h2 className="text-xl font-bold mb-5 text-blue-400">
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
                                    `/css/lesson/${previousLesson.id}`
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
                                    `/css/lesson/${nextLesson.id}`
                                )
                            }
                            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500"
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
