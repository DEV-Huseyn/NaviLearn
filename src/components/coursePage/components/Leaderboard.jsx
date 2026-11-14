
import React from 'react'

const Leaderboard = ({ topFive, currentUser, currentUserPlace }) => {

    const userId = localStorage.getItem('userId')

    return (
        <main id="ranking" className="mx-auto w-[96%] sm:w-[90%] lg:w-[550px] px-2 sm:px-4 my-6 sm:my-8 text-center">

            <div className="w-full overflow-hidden rounded-xl bg-[#10231e] border border-[#285044] shadow-[0_8px_25px_rgba(0,0,0,0.18)]">

                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#285044] bg-[#16352b]">

                    <h2 className="text-lg sm:text-xl font-bold text-[#d1fae5] tracking-wide">
                        Пользователи
                    </h2>

                    <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#6ee7b7] bg-[#1d493a] px-3 py-1 rounded-md">
                        NAVILEARN
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[220px] border-collapse">

                        <thead>
                            <tr className="bg-[#142d25]">
                                <th className="px-3 sm:px-5 py-3 text-xs font-semibold text-[#6ee7b7]">#</th>
                                <th className="px-3 sm:px-5 py-3 text-xs font-semibold text-[#6ee7b7]">Пользователь</th>
                                <th className="px-3 sm:px-5 py-3 text-xs font-semibold text-[#6ee7b7]">EXP</th>
                            </tr>
                        </thead>

                        <tbody>
                            {topFive.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`border-t border-[#203e33] transition-colors ${
                                        String(user.id) === String(userId)
                                            ? 'bg-[#24664c]'
                                            : 'hover:bg-[#193b30]'
                                    }`}
                                >

                                    <td className="px-2 sm:px-5 py-2 text-sm font-semibold text-[#6ee7b7]">
                                        {index + 1}
                                    </td>

                                    <td className="px-2 sm:px-5 py-2 text-sm font-medium text-[#ecfdf5]">
                                        {user.name}
                                        {String(user.id) === String(userId) && ' (Вы)'}
                                    </td>

                                    <td className="px-2 sm:px-5 py-2 text-sm font-bold text-[#a7f3d0]">
                                        {user.exp || 0}
                                    </td>

                                </tr>
                            ))}

                            {currentUser && currentUserPlace > 5 && (
                                <>
                                    <tr>
                                        <td colSpan={3} className="py-2 text-xs font-semibold text-[#6ee7b7] bg-[#16352b]">
                                            ВАШЕ МЕСТО В РЕЙТИНГЕ
                                        </td>
                                    </tr>

                                    <tr className="border-t border-[#6ee7b7]/30 bg-[#1b4938]">
                                        <td className="px-2 sm:px-5 py-2 text-sm font-bold text-[#6ee7b7]">
                                            {currentUserPlace}
                                        </td>

                                        <td className="px-2 sm:px-5 py-2 text-sm font-semibold text-white">
                                            {currentUser.name} (Вы)
                                        </td>

                                        <td className="px-2 sm:px-5 py-2 text-sm font-bold text-[#a7f3d0]">
                                            {currentUser.exp || 0}
                                        </td>
                                    </tr>
                                </>
                            )}

                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-2.5 border-t border-[#203e33] text-[10px] sm:text-xs text-[#648b7b] text-left">
                    NaviLearn · User Ranking
                </div>

            </div>
        </main>
    )
}

export default Leaderboard
