
import React from 'react'

const Profile = ({ currentUser, logout }) => {
    if (!currentUser) return null

    return (
        <div id="profile" className="mx-auto w-[96%] sm:w-[90%] lg:w-[550px]
            mt-6 px-4 py-5 rounded-2xl
            bg-gradient-to-br from-[#1b4938] via-[#153b30] to-[#102b23]
            border border-emerald-500/30
            shadow-[0_8px_25px_rgba(0,0,0,0.25)]
            text-left">

            <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center
                        rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600
                        text-[#103326] text-xl font-black">
                        {currentUser.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-emerald-400 mb-1">Ваш профиль</p>

                        <h2 className="text-lg font-bold text-white truncate">
                            {currentUser.name}
                        </h2>

                        <p className="text-xs text-emerald-300/70">
                            Участник NaviLearn
                        </p>
                    </div>
                </div>

                <div className="shrink-0 text-center bg-[#0d2920]/70
                    border border-emerald-500/20 rounded-xl px-4 py-2">

                    <p className="text-[10px] text-emerald-400 font-semibold">
                        EXP
                    </p>

                    <p className="text-2xl font-black text-emerald-300">
                        {currentUser.exp || 0}
                    </p>
                </div>
            </div>

            <div className="h-px bg-emerald-500/20 my-4"></div>

            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2
                    py-2.5 rounded-xl bg-red-500/10 border border-red-400/20
                    text-red-300 text-sm font-semibold
                    hover:bg-red-500/20 hover:border-red-400/50
                    transition-all duration-300 cursor-pointer">

                Выйти из аккаунта
            </button>

        </div>
    )
}

export default Profile
