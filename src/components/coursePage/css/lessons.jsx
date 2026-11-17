import React from 'react'
import { useParams } from 'react-router'
import cssCourse from './css.json'

function Lessons() {
  const { id } = useParams()

  const lessons = cssCourse.modules.flatMap(module => module.lessons)
  const lesson = lessons.find(item => item.id === id)

  if (!lesson) {
    return <h1>Урок не найден</h1>
  }

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.theory}</p>

      <h2>Практика</h2>
      <p>{lesson.practice.description}</p>
      <p>{lesson.practice.task}</p>
    </div>
  )
}

export default Lessons