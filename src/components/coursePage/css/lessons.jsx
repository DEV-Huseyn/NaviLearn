
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import cssCourse from './css.json'

function Lessons() {
  const { id } = useParams()
  const navigate = useNavigate()

  const lessons = cssCourse.modules.flatMap(module => module.lessons)
  const lessonIndex = lessons.findIndex(item => item.id === id)
  const lesson = lessons[lessonIndex]

  const storageKey = `navilearn-css-${id}`

  const [completed, setCompleted] = useState(
    localStorage.getItem(storageKey) === 'true'
  )

  if (!lesson) {
    return <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center">Урок не найден</div>
  }

  const firstLocked = lessons.findIndex((item, index) =>
    index < lessonIndex &&
    localStorage.getItem(`navilearn-css-${item.id}`) !== 'true'
  )

  if (firstLocked !== -1) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center p-5">
        <div className="bg-[#151f32] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-5">🔒</div>
          <h1 className="text-2xl font-bold mb-3">Урок заблокирован</h1>
          <p className="text-gray-400 mb-6">
            Сначала заверши предыдущие уроки, чтобы открыть этот.
          </p>
          <button
            onClick={() => navigate(`/css/lesson/${lessons[firstLocked].id}`)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
          >
            Перейти к уроку
          </button>
        </div>
      </div>
    )
  }

  const previousLesson = lessons[lessonIndex - 1]
  const nextLesson = lessons[lessonIndex + 1]

  function completeLesson() {
    localStorage.setItem(storageKey, 'true')
    setCompleted(true)

    if (nextLesson) {
      navigate(`/css/lesson/${nextLesson.id}`)
    } else {
      navigate('/css')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate('/css')}
          className="text-gray-400 hover:text-blue-400 transition mb-8"
        >
          ← Вернуться к CSS
        </button>

        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-4">
            CSS • Урок {lessonIndex + 1}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {lesson.title}
          </h1>

          <p className="text-gray-400">
            Изучай теорию и выполняй практические задания.
          </p>
        </div>

        <div className="bg-[#151f32] border border-white/5 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold mb-5">📘 Теория</h2>
          <div className="text-gray-300 leading-8 whitespace-pre-line">
            {lesson.theory}
          </div>
        </div>

        <div className="bg-[#151f32] border border-blue-500/20 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-5">💻 Практическое задание</h2>

          <p className="text-gray-300 leading-7 mb-5">
            {lesson.practice.description}
          </p>

          <div className="bg-[#0b1120] border border-white/5 rounded-xl p-5">
            <p className="text-sm text-blue-400 font-semibold mb-2">
              ТВОЯ ЗАДАЧА
            </p>
            <p className="text-gray-200 leading-7">
              {lesson.practice.task}
            </p>
          </div>

          <p className="mt-5 text-yellow-400 text-sm">
            ⭐ Награда: +10 XP
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          {previousLesson && (
            <button
              onClick={() => navigate(`/css/lesson/${previousLesson.id}`)}
              className="px-5 py-3 rounded-xl bg-[#151f32] border border-white/10 hover:border-blue-500 transition"
            >
              ← Предыдущий
            </button>
          )}

          {!completed ? (
            <button
              onClick={completeLesson}
              className="ml-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
            >
              Завершить урок →
            </button>
          ) : (
            <div className="ml-auto text-green-400 font-semibold py-3">
              ✓ Урок пройден
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Lessons
