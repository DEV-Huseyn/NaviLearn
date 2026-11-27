
import React from 'react'

const Home = ({ currentUser, setActivePage }) => {

    return (
        <section className="bg-black mx-auto w-[96%] sm:w-[90%] lg:w-[550px] mt-7 mb-8">

            {/* Приветствие */}
            <div className="mb-6 px-2">
                <p className="text-sm text-emerald-700 font-medium">
                    Добро пожаловать в NaviLearn!
                </p>

                <h2 className="text-2xl sm:text-3xl font-black text-[#153b30] mt-1">
                    Привет, {currentUser?.name || 'Ученик'} 👋
                </h2>

                <p className="text-sm text-emerald-800/70 mt-2">
                    Продолжай учиться и становись лучше каждый день.
                </p>
            </div>

            {/* Карточка пользователя */}
            <div className="rounded-2xl p-5
                bg-gradient-to-br from-[#1b4938] via-[#153b30] to-[#102b23]
                border border-emerald-500/30
                shadow-[0_8px_25px_rgba(0,0,0,0.2)]">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-xs text-emerald-300/70">
                            ТВОЙ ПРОГРЕСС
                        </p>

                        <h3 className="text-xl font-bold text-white mt-2">
                            Продолжай в том же духе!
                        </h3>
                    </div>

                    <div className="text-4xl">🏆</div>

                </div>

                <div className="mt-5 flex items-center justify-between
                    bg-[#0d2920]/70 rounded-xl px-4 py-3">

                    <span className="text-sm text-emerald-200">
                        Твой опыт
                    </span>

                    <span className="text-xl font-black text-emerald-300">
                        {currentUser?.exp || 0} EXP
                    </span>

                </div>
            </div>

            {/* Быстрый переход */}
            <div className="mt-7">

                <h3 className="text-lg font-bold text-[#153b30] mb-4">
                    Быстрый доступ
                </h3>

                <div className="grid grid-cols-2 gap-3">

                    <button
                        onClick={() => setActivePage('courses')}
                        className="text-left p-4 rounded-2xl
                            bg-gradient-to-br from-[#153b30] to-[#1d5944]
                            border border-emerald-700/40
                            hover:-translate-y-1 hover:shadow-lg
                            transition-all duration-300 cursor-pointer">

                        <span className="text-3xl">📚</span>

                        <h4 className="text-emerald-100 font-bold mt-3">
                            Мои курсы
                        </h4>

                        <p className="text-xs text-emerald-300 mt-1">
                            Начать обучение
                        </p>
                    </button>

                    <button
                        onClick={() => setActivePage('ranking')}
                        className="text-left p-4 rounded-2xl
                            bg-gradient-to-br from-[#153b30] to-[#1d5944]
                            border border-emerald-700/40
                            hover:-translate-y-1 hover:shadow-lg
                            transition-all duration-300 cursor-pointer">

                        <span className="text-3xl">🥇</span>

                        <h4 className="text-emerald-100 font-bold mt-3">
                            Рейтинг
                        </h4>

                        <p className="text-xs text-emerald-300 mt-1">
                            Посмотреть места
                        </p>
                    </button>

                </div>
            </div>

            {/* Мотивация */}
            <div className="mt-5 p-4 rounded-2xl
                bg-[#d1fae5]/70 border border-emerald-300/60">

                <p className="text-sm font-bold text-emerald-900">
                    💡 Маленький совет
                </p>

                <p className="text-sm text-emerald-800 mt-2">
                    Даже 15 минут обучения каждый день
                    помогут тебе достичь больших результатов!
                </p>

            </div>

        </section>
    )
}

export default Home
