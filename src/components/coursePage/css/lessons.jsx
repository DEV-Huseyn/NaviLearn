{/* Кнопки */}
<div className="flex flex-col sm:flex-row gap-3">
    {!completedTasks.includes(task.id) && (
        <button
            onClick={checkTask}
            className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer py-3 rounded-xl font-semibold transition"
        >
            Проверить
        </button>
    )}

    <button
        onClick={() => {
            if (!isCorrect) return

            if (taskIndex < lesson.tasks.length - 1) {
                setTaskIndex(prev => prev + 1)
            } else {
                localStorage.setItem(storageKey, 'true')

                if (nextLesson) {
                    navigate(`/css/lesson/${nextLesson.id}`)
                } else {
                    navigate('/css')
                }
            }
        }}
        disabled={!isCorrect}
        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer py-3 rounded-xl font-semibold transition"
    >
        {taskIndex === lesson.tasks.length - 1
            ? 'Завершить урок'
            : 'Следующее задание →'
        }
    </button>
</div>