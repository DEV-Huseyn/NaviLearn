
import React from 'react'
import { useNavigate } from 'react-router'
import jsCourse from './js.json'

const Javascript = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-950 text-white p-5 sm:p-8">

            <div className="max-w-5xl mx-auto">

                <button
                    onClick={() => navigate('/course')}
                    className="text-yellow-400 hover:text-yellow-300 mb-6"
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
                            {jsCourse.modules.reduce(
                                (total, module) =>
                                    total + module.lessons.length, 0
                            )} уроков
                        </span>
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

                                {module.lessons.map((lesson, lessonIndex) => (

                                    <button
                                        key={lesson.id}
                                        onClick={() =>
                                            navigate(`/js/lesson/${lesson.id}`)
                                        }
                                        className="w-full text-left flex items-center justify-between gap-3 bg-slate-800/70 hover:bg-slate-700 p-4 rounded-xl transition"
                                    >

                                        <div className="flex items-center gap-3">

                                            <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                                                {lessonIndex + 1}
                                            </span>

                                            <span className="font-medium">
                                                {lesson.title}
                                            </span>

                                        </div>

                                        <span className="text-yellow-400">
                                            →
                                        </span>

                                    </button>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default Javascript
