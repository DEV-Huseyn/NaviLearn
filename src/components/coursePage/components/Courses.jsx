
import React from 'react'
import { useNavigate } from 'react-router'

const Courses = () => {

    const navigate = useNavigate()

    return (
        <section id="courses" className="mx-auto w-[96%] sm:w-[90%] lg:w-[550px] py-1.5 px-2 sm:px-4 my-6 sm:my-8 text-center">

            <h1 className="text-center my-5 text-4xl sm:text-5xl text-emerald-800 font-black tracking-wider">
                КУРСЫ
            </h1>

            <div className="flex flex-col mx-auto w-full max-w-[500px] gap-3 sm:gap-4 cursor-pointer">

                {/* HTML */}
                <div
                    onClick={() => navigate('/html')}
                    className="w-full min-h-[75px] sm:min-h-[85px] flex items-center justify-between px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#153b30] to-[#1d5944] border border-emerald-700/50 shadow-[0_5px_15px_rgba(6,78,59,0.15)] hover:shadow-[0_8px_22px_rgba(6,78,59,0.3)] hover:-translate-y-1 hover:border-emerald-400/60 transition-all duration-300">

                    <div className="text-left">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-100">HTML</h2>
                        <p className="text-xs sm:text-sm text-emerald-400 mt-1">Структура веб-страниц</p>
                    </div>

                    <span className="text-2xl sm:text-3xl font-black text-orange-400">5</span>
                </div>

                {/* CSS */}
                <div
                    onClick={() => navigate('/css')}
                    className="w-full min-h-[75px] sm:min-h-[85px] flex items-center justify-between px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#153b30] to-[#1d5944] border border-emerald-700/50 shadow-[0_5px_15px_rgba(6,78,59,0.15)] hover:shadow-[0_8px_22px_rgba(6,78,59,0.3)] hover:-translate-y-1 hover:border-emerald-400/60 transition-all duration-300">

                    <div className="text-left">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-100">CSS</h2>
                        <p className="text-xs sm:text-sm text-emerald-400 mt-1">Стилизация веб-страниц</p>
                    </div>

                    <span className="text-2xl sm:text-3xl font-black text-blue-400">3</span>
                </div>

                {/* JavaScript */}
                <div
                    onClick={() => navigate('/javascript')}
                    className="w-full min-h-[75px] sm:min-h-[85px] flex items-center justify-between px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#153b30] to-[#1d5944] border border-emerald-700/50 shadow-[0_5px_15px_rgba(6,78,59,0.15)] hover:shadow-[0_8px_22px_rgba(6,78,59,0.3)] hover:-translate-y-1 hover:border-emerald-400/60 transition-all duration-300">

                    <div className="text-left">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-100">JavaScript</h2>
                        <p className="text-xs sm:text-sm text-emerald-400 mt-1">Логика и интерактивность</p>
                    </div>

                    <span className="text-2xl sm:text-3xl font-black text-yellow-400">7</span>
                </div>

            </div>
        </section>
    )
}

export default Courses
