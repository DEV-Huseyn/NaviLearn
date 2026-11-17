
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import javascriptCourse from './js.json'

function LessonsJS() {
  const { id } = useParams()
  const navigate = useNavigate()

  const lessons = javascriptCourse.lessons || []

  const lessonIndex = lessons.findIndex(
    item => String(item.id) === String(id)
  )

  const lesson = lessons[lessonIndex]

  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState({})
  const [completed, setCompleted] = useState(false)
  const [showHint, setShowHint] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!lesson) {
      navigate('/javascript')
      return
    }

    if (lessonIndex > 0) {
      const previousLesson = lessons[lessonIndex - 1]
      const previousCompleted = localStorage.getItem(
        `js_lesson_${previousLesson.id}_completed`
      )

      if (previousCompleted !== 'true') {
        navigate(`/javascript/lesson/${previousLesson.id}`)
        return
      }
    }

    const savedResults = JSON.parse(
      localStorage.getItem(`js_lesson_${id}_results`) || '{}'
    )

    setAnswers({})
    setResults(savedResults)
    setShowHint({})
    setErrors({})

    setCompleted(
      localStorage.getItem(`js_lesson_${id}_completed`) === 'true'
    )
  }, [id])

  if (!lesson) return null

  const saveAnswer = (taskId, value) => {
    setAnswers(prev => ({
      ...prev,
      [taskId]: value
    }))

    setErrors(prev => ({
      ...prev,
      [taskId]: ''
    }))
  }

  const checkTask = task => {
    const answer = answers[task.id]

    if (task.type === 'choice') {
      if (answer === undefined || answer === '') {
        setErrors(prev => ({
          ...prev,
          [task.id]: 'Выбери один ответ!'
        }))
        return
      }

      if (Number(answer) !== task.answer) {
        setErrors(prev => ({
          ...prev,
          [task.id]: 'Неправильный ответ. Попробуй ещё раз!'
        }))
        return
      }
    } else if (task.type === 'code' || task.type === 'project') {
      if (!answer || !answer.trim()) {
        setErrors(prev => ({
          ...prev,
          [task.id]: 'Сначала напиши свой код!'
        }))
        return
      }

      const code = answer.toLowerCase()

      const isCorrect = (task.checks || []).every(check =>
        code.includes(check.toLowerCase())
      )

      if (!isCorrect) {
        setErrors(prev => ({
          ...prev,
          [task.id]: 'Код пока не соответствует заданию. Проверь его!'
        }))
        return
      }
    }

    const updatedResults = {
      ...results,
      [task.id]: true
    }

    setResults(updatedResults)

    localStorage.setItem(
      `js_lesson_${id}_results`,
      JSON.stringify(updatedResults)
    )

    setErrors(prev => ({
      ...prev,
      [task.id]: ''
    }))
  }

  const allTasksCompleted = lesson.tasks.every(
    task => results[task.id]
  )

  const finishLesson = () => {
    if (!allTasksCompleted) return

    localStorage.setItem(`js_lesson_${id}_completed`, 'true')
    setCompleted(true)
  }

  const nextLesson = () => {
    if (lessonIndex === lessons.length - 1) {
      navigate('/course')
    } else {
      navigate(`/javascript/lesson/${lessons[lessonIndex + 1].id}`)
    }
  }

  const completedCount = Object.values(results).filter(Boolean).length

  return (
    <div className="lesson-container">

      <div className="lesson-header">
        <button
          onClick={() => navigate('/javascript')}
          style={{ cursor: 'pointer' }}
        >
          ← Назад к курсу
        </button>

        <h1>{lesson.title}</h1>

        <p>
          Урок {lessonIndex + 1} из {lessons.length}
        </p>
      </div>

      <div className="lesson-theory">
        <h2>📚 Теория</h2>

        {lesson.theory.map((item, index) => (
          <div className="theory-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <div className="lesson-example">
        <h2>💻 Пример кода</h2>

        <pre>
          <code>{lesson.example}</code>
        </pre>
      </div>

      <div className="lesson-practice">
        <h2>🚀 Практика</h2>

        {lesson.tasks.map((task, index) => (
          <div className="task-card" key={task.id}>

            <h3>
              Задание {index + 1}: {task.title}
            </h3>

            <p>{task.description}</p>

            {task.type === 'choice' && (
              <div className="task-options">
                {task.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => saveAnswer(task.id, optionIndex)}
                    disabled={results[task.id]}
                    className={
                      answers[task.id] === optionIndex ? 'selected' : ''
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {(task.type === 'code' || task.type === 'project') && (
              <textarea
                value={answers[task.id] || ''}
                onChange={e => saveAnswer(task.id, e.target.value)}
                disabled={results[task.id]}
                placeholder="Напиши свой JavaScript код..."
                rows={8}
              />
            )}

            {errors[task.id] && (
              <p className="task-error">
                {errors[task.id]}
              </p>
            )}

            {showHint[task.id] && (
              <div className="task-hint">
                💡 {task.hint}
              </div>
            )}

            <div className="task-actions">

              <button
                onClick={() => setShowHint(prev => ({
                  ...prev,
                  [task.id]: !prev[task.id]
                }))}
                style={{ cursor: 'pointer' }}
              >
                💡 Подсказка
              </button>

              <button
                onClick={() => checkTask(task)}
                disabled={results[task.id]}
                style={{ cursor: 'pointer' }}
              >
                {results[task.id] ? '✓ Выполнено' : 'Проверить'}
              </button>

            </div>

            {results[task.id] && (
              <p className="task-success">
                ✓ Отлично! Задание выполнено.
              </p>
            )}

          </div>
        ))}
      </div>

      <div className="lesson-footer">

        <p>
          Выполнено: {completedCount} / {lesson.tasks.length}
        </p>

        <p>Награда за урок: {lesson.exp} EXP</p>

        {!completed && (
          <button
            onClick={finishLesson}
            disabled={!allTasksCompleted}
            style={{ cursor: 'pointer' }}
          >
            Завершить урок
          </button>
        )}

        {completed && (
          <button
            onClick={nextLesson}
            style={{ cursor: 'pointer' }}
          >
            {lessonIndex === lessons.length - 1
              ? 'Завершить курс'
              : 'Следующий урок →'}
          </button>
        )}

      </div>

    </div>
  )
}

export default LessonsJS
