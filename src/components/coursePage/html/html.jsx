import React from 'react'
import { useNavigate } from 'react-router'
import htmlCourse from './html.json'

const Html = () => {
  const navigate = useNavigate();
  return (
    <>
<div className="min-h-screen w-full bg-[#0b1715] px-4 py-10 sm:px-8">
      <h1
        onClick={() => navigate('/course')}
        className="
          inline-flex items-center gap-2
          text-emerald-300
          font-semibold text-lg
          cursor-pointer
          transition-all duration-300
          hover:text-emerald-200
          hover:-translate-x-1
          mb-6
        "
      >
        <span>←</span>
        Назад
      </h1>
    <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-center text-3xl sm:text-5xl font-bold text-emerald-300">
            {htmlCourse.title}
        </h1>

        <p className="mb-10 text-center text-sm sm:text-base text-gray-400">
            Изучай HTML с нуля и создавай собственные сайты
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        
            {htmlCourse.lessons.map((lesson, index) => (
                <div
                    key={lesson.id}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#142521] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-[#19332b] hover:shadow-xl hover:shadow-emerald-950/40"
                >

                    <div className="mb-5 flex items-center justify-between">

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-lg font-bold text-emerald-300">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            +{lesson.exp} EXP
                        </span>

                    </div>

                    <h2 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-emerald-300">
                        {lesson.title}
                    </h2>

                    <p className="mb-6 min-h-[48px] text-sm leading-6 text-gray-400">
                        {lesson.description}
                    </p>

                    <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-[#263b34]">
                        <div className="h-full w-0 rounded-full bg-emerald-400 transition-all duration-500 group-hover:w-full"></div>
                    </div>

                    <button
                        onClick={() => navigate(`/html/lesson/${lesson.id}`)}
                        className="w-full cursor-pointer rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-[#092018] transition-all duration-300 hover:bg-emerald-400 active:scale-[0.97]"
                    >
                        Начать урок
                    </button>

                </div>
            ))}

        </div>
    </div>
</div>

    </>
  )
}

export default Html