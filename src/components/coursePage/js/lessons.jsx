
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import jsCourse from './js.json'

function LessonsJS() {
  const { id } = useParams()
  const navigate = useNavigate()

  const lessons = jsCourse.modules.flatMap(module => module.lessons)
  const lessonIndex = lessons.findIndex(item => item.id === id)
  const lesson = lessons[lessonIndex]

  const [code, setCode] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  const storageKey = `navilearn-js-${id}`

  useEffect(() => {
    setCode(localStorage.getItem(`${storageKey}-code`) || '')
    setIsCompleted(localStorage.getItem(storageKey) === 'true')
  }, [id])

  if (!lesson) {
    return <div className="p-8 text-white">Урок не найден</div>
  }

  const previousLesson = lessons[lessonIndex - 1]
  const isLocked =
    previousLesson &&
    localStorage.getItem(`navilearn-js-${previousLesson.id}`) !== 'true'

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-3">Урок заблокирован</h2>
        <p className="text-gray-400 mb-5">
          Сначала заверши предыдущий урок.
        </p>
        <button
          onClick={() => navigate('/javascript')}
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold"
        >
          Назад к курсу
        </button>
      </div>
    )
  }

  const saveCode = value => {
    setCode(value)
    localStorage.setItem(`${storageKey}-code`, value)
  }

  const completeLesson = () => {
    if (!code.trim()) return

    localStorage.setItem(storageKey, 'true')
    setIsCompleted(true)

    const nextLesson = lessons[lessonIndex + 1]

    if (nextLesson) {
      navigate(`/javascript/lesson/${nextLesson.id}`)
    } else {
      navigate('/javascript')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate('/javascript')}
          className="text-yellow-400 mb-6 hover:text-yellow-300"
        >
          ← Назад к курсу
        </button>

        <div className="mb-8">
          <p className="text-yellow-400 text-sm mb-2">
            JavaScript · Урок {lessonIndex + 1} из {lessons.length}
          </p>

          <h1 className="text-3xl font-bold mb-3">
            {lesson.title}
          </h1>
        </div>

        {/* Теория */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Теория</h2>
          <p className="text-gray-300 whitespace-pre-line leading-7">
            {lesson.theory}
          </p>
        </section>

        {/* Практика */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">
            Практика
          </h2>

          <p className="text-gray-300 mb-3">
            {lesson.practice.description}
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5">
            <p className="text-gray-300 whitespace-pre-line">
              {lesson.practice.task}
            </p>
          </div>

          {/* Редактор кода */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-sm">
                Твой код
              </label>
              <span className="text-gray-500 text-xs">
                JavaScript Editor
              </span>
            </div>

            <textarea
              value={code}
              onChange={e => saveCode(e.target.value)}
              placeholder="Напиши свой JavaScript-код здесь..."
              spellCheck={false}
              className="w-full min-h-[250px] resize-y bg-[#080d18] border border-slate-700 rounded-xl p-4 text-yellow-300 font-mono text-sm outline-none focus:border-yellow-500"
            />
          </div>

          <button
            onClick={completeLesson}
            disabled={!code.trim()}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
          >
            {isCompleted ? 'Урок завершён' : 'Завершить урок'}
          </button>
        </section>

      </div>
    </div>
  )
}

export default LessonsJS
