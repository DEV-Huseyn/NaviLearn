
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import htmlCourse from './html.json'

function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()

  const lesson = htmlCourse.lessons.find(
    lesson => lesson.id === Number(id)
  )

  if (!lesson) return <h1>Урок не найден</h1>

  const lessonId = htmlCourse.lessons.findIndex(
    item => item.id === Number(id)
  )

  const previousLesson = htmlCourse.lessons[lessonId - 1]

  const isLocked = lessonId > 0 &&
    !localStorage.getItem(`html_lesson_${previousLesson.id}_completed`)

  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#0b1715] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">
          🔒 Урок закрыт
        </h1>

        <p className="text-gray-400 mb-4">
          Сначала пройди предыдущий урок!
        </p>

        <button
          onClick={() => navigate('/html')}
          className="rounded-xl bg-emerald-500 p-3 text-black font-bold cursor-pointer"
        >
          Вернуться к урокам
        </button>
      </div>
    )
  }

  function handleAnswer(questionId, answer) {
    setAnswers({
      ...answers,
      [questionId]: answer
    })
  }

  function checkAnswer(question, questionId) {
    const answer = answers[questionId]

    if (question.type === 'choice') {
      return answer === question.answer
    }

    const code = String(answer || question.starterCode || '').toLowerCase()

    return question.checks?.every(
      word => code.includes(word.toLowerCase())
    ) || false
  }

  function checkAnswers() {
    setChecked(true)

    const success = lesson.tasks.every(
      (question, questionId) => checkAnswer(question, questionId)
    )

    if (success) {
      localStorage.setItem(
        `html_lesson_${lesson.id}_completed`,
        'true'
      )
    }
  }

  const correct = lesson.tasks.filter(
    (question, questionId) => checkAnswer(question, questionId)
  ).length

  const allCorrect = correct === lesson.tasks.length

  return (
    <div className="min-h-screen bg-[#0b1715] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        <button className="cursor-pointer" onClick={() => navigate('/html')}>
          ← Все уроки
        </button>

        <h1 className="my-6 text-3xl font-bold">
          {lesson.title}
        </h1>

        <p className="mb-6 text-gray-400">
          {lesson.description}
        </p>

        <h2 className="mb-4 text-xl font-bold text-emerald-400">
          Теория
        </h2>

        {lesson.theory.map((part, questionId) => (
          <div key={questionId} className="mb-4 rounded-xl bg-[#142521] p-4">
            <h3 className="mb-2 font-bold">{part.title}</h3>
            <p className="text-gray-300">{part.text}</p>
          </div>
        ))}

        <h2 className="mb-4 mt-8 text-xl font-bold text-emerald-400">
          Пример
        </h2>

        <pre className="overflow-x-auto rounded-xl bg-[#101c1b] p-4 text-emerald-300">
          <code>{lesson.example}</code>
        </pre>

        <h2 className="mb-4 mt-8 text-xl font-bold text-emerald-400">
          Практика
        </h2>

        {lesson.tasks.map((question, questionId) => (
          <div key={question.id} className="mb-5 rounded-xl bg-[#142521] p-5">

            <h3 className="mb-2 font-bold">
              {question.title}
            </h3>

            <p className="mb-4 text-gray-300">
              {question.description}
            </p>

            {question.type === 'choice' ? (
              question.options.map((option, optionId) => (
                <button
                  key={optionId}
                  disabled={checked}
                  onClick={() => handleAnswer(questionId, optionId)}
                  className={`mb-2 block w-full cursor-pointer rounded-lg p-3 text-left ${
                    answers[questionId] === optionId
                      ? 'bg-emerald-600'
                      : 'bg-[#101c1b] hover:bg-[#20372f]'
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <textarea
                disabled={checked}
                value={answers[questionId] ?? question.starterCode ?? ''}
                onChange={e => handleAnswer(questionId, e.target.value)}
                placeholder="Напиши HTML-код..."
                rows={6}
                className="w-full rounded-lg bg-[#101c1b] p-4 font-mono text-emerald-300"
              />
            )}

            {question.hint && (
              <p className="mt-3 text-sm text-gray-400">
                Подсказка: {question.hint}
              </p>
            )}

            {checked && (
              <p className="mt-3 font-bold">
                {checkAnswer(question, questionId)
                  ? '✓ Правильно'
                  : '✗ Неправильно'}
              </p>
            )}

          </div>
        ))}

        {!checked ? (
          <button
            onClick={checkAnswers}
            disabled={lesson.tasks.some((question, questionId) =>
              question.type === 'choice'
                ? answers[questionId] === undefined
                : !String(answers[questionId] ?? question.starterCode ?? '').trim()
            )}
            className="w-full cursor-pointer rounded-xl bg-emerald-500 p-4 font-bold text-black disabled:opacity-40"
          >
            Проверить ответы
          </button>
        ) : (
          <div className="mt-6 rounded-xl bg-[#142521] p-5 text-center">

            <h2 className="mb-3 text-xl font-bold">
              Результат: {correct} из {lesson.tasks.length}
            </h2>

            {allCorrect ? (
              <button
                onClick={() => navigate('/html')}
                className="rounded-xl cursor-pointer bg-emerald-500 p-3 font-bold text-black"
              >
                Вернуться к урокам
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnswers({})
                  setChecked(false)
                }}
                className="rounded-xl bg-emerald-500 cursor-pointer p-3 font-bold text-black"
              >
                Попробовать снова
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default Lesson
