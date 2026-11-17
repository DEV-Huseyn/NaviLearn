
import React from 'react'
import { useNavigate } from 'react-router'
import cssCourse from './css.json'

const Css = () => {
  const navigate = useNavigate()

  const course = cssCourse
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

        <button
          onClick={() => navigate('/course')}
          className="text-emerald-400 cursor-pointer hover:text-emerald-300 mb-6"
        >
          ← Назад к курсам
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-400">
            {course.title}
          </h1>

          <p className="text-slate-400 mt-3">
            {course.description}
          </p>

          <div className="flex gap-4 mt-5 flex-wrap">

            <span className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl">
              {lessons.length} уроков
            </span>

            <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl">
              {totalTasks} заданий
            </span>

            <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-xl">
              🏆 {totalXP} EXP
            </span>

          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <h2 className="text-xl font-bold mb-4">
            Программа курса
          </h2>

          <div className="space-y-3">

            {lessons.map((lesson, index) => (

              <button
                key={lesson.id}
                onClick={() => navigate(`/css/lesson/${lesson.id}`)}
                className="w-full text-left flex cursor-pointer items-center justify-between gap-3 bg-slate-800/70 hover:bg-slate-700 p-4 rounded-xl transition"
              >

                <div className="flex items-center gap-3">

                  <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    {index + 1}
                  </span>

                  <div>
                    <span className="font-medium block">
                      {lesson.title}
                    </span>

                    <span className="text-sm text-slate-400">
                      {lesson.tasks.length} заданий
                    </span>
                  </div>

                </div>

                <span className="text-yellow-400 whitespace-nowrap">
                  +{lesson.exp} XP
                </span>

              </button>

            ))}

          </div>
        </div>

      </div>
    </div>
  )
}

export default Css
