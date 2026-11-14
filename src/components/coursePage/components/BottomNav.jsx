
import React from 'react'

const BottomNav = ({ activePage, setActivePage }) => {

    const navItems = [
        { id: 'home', icon: '⌂', label: 'Главная' },
        { id: 'profile', icon: '♙', label: 'Профиль' },
        { id: 'ranking', icon: '♛', label: 'Рейтинг' },
        { id: 'courses', icon: '▤', label: 'Курсы' }
    ]

    return (
        <nav className="bottom-nav fixed bottom-3 left-1/2 -translate-x-1/2
            z-50 w-[94%] max-w-[480px]">

            <div className="flex items-center justify-around
                px-2 py-2 rounded-2xl
                bg-[#102b23]/95 backdrop-blur-xl
                border border-emerald-500/30
                shadow-[0_8px_30px_rgba(0,0,0,0.4)]">

                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`nav-item flex flex-col items-center justify-center
                            gap-1 min-w-0 flex-1 py-2 rounded-xl
                            transition-all duration-300 cursor-pointer
                            ${activePage === item.id
                                ? 'nav-active text-emerald-300 bg-emerald-500/15'
                                : 'text-emerald-100/50 hover:text-emerald-300'
                            }`}
                    >
                        <span className="nav-icon text-xl leading-none">
                            {item.icon}
                        </span>

                        <span className="text-[10px] sm:text-xs font-semibold">
                            {item.label}
                        </span>
                    </button>
                ))}

            </div>
        </nav>
    )
}

export default BottomNav
