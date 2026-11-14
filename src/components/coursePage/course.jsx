import { useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'
import NaviLogo from '../../gift/NaviLearnLogo.gif'
import axios from 'axios'

import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'
import Courses from './components/Courses'
import BottomNav from './components/BottomNav'
import Home from './components/Home'


const Course = ({ setIsLoggedIn }) => {

    const [users, setUsers] = useState([])
    const [activePage, setActivePage] = useState('home')

    const navigate = useNavigate()

    // Сортировка пользователей
    const sortedUsers = [...(Array.isArray(users) ? users : [])].sort((userA, userB) => Number(userB.exp || 0) - Number(userA.exp || 0))

    // Топ 5
    const topFive = sortedUsers.slice(0, 5)

    // Текущий пользователь
    const currentUser = sortedUsers.find(user => String(user.id) === String(localStorage.getItem('userId')))

    // Место пользователя
    const currentUserPlace = currentUser ? sortedUsers.findIndex(user => String(user.id) === String(currentUser.id)) + 1 : 0

    // Выход
    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        
        setIsLoggedIn(false)
        navigate('/sign__up')
    }

   const API = "https://dcn481.dcn.tj/Novilearn/api";

// Получение пользователей
const getUsers = async () => {
    try {
        const response = await axios.get(
            `${API}/user/users.php`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    Accept: 'application/json'
                }
            }
        );

        if (response.data.success) {
            setUsers(response.data.data.users || []);
        }

    } catch (error) {
        console.error(
            'Ошибка загрузки пользователей:',
            error.response?.status,
            error.response?.data || error.message
        );
    }
};

    useEffect(() => {
        getUsers()
    }, [])

    // Название текущего раздела
    
    const pageTitles = {
        home: 'Главная',
        profile: 'Мой профиль',
        ranking: 'Рейтинг пользователей',
        courses: 'Мои курсы'
    }

    return (
        <div className="min-h-screen pb-28">

            {/* HEADER */}

            <header className="w-[95%] sm:w-[85%] lg:w-[550px] min-h-[100px] sm:h-[120px] p-4 sm:p-5 mx-auto bg-gradient-to-br from-[#6fffb5] via-[#86ceac] to-[#386359] border border-emerald-100/70 shadow-[0_20px_60px_-15px_rgba(6,78,59,0.35),0_8px_25px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.6)] rounded-b-2xl sm:rounded-b-3xl backdrop-blur-xl">

                <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 h-full">

                    <img
                        className="w-[65px] h-[65px] sm:w-[85px] sm:h-[80px] object-contain drop-shadow-[0_4px_6px_rgba(6,78,59,0.25)]"
                        src={NaviLogo}
                        alt="LOGO"
                    />

                    <div className="flex items-center gap-2 sm:gap-3">

                        <h1 className="font-extrabold text-3xl sm:text-5xl tracking-tight text-[#064e3b]">
                            NAVI
                        </h1>

                        <h1 className="font-semibold text-3xl sm:text-5xl tracking-tight text-[#ecfdf5]">
                            LEARN
                        </h1>

                    </div>
                </div>
            </header>

            {/* ЗАГОЛОВОК РАЗДЕЛА */}

            <div className="mx-auto w-[96%] sm:w-[90%] lg:w-[550px] mt-7 mb-5 px-2">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase">
                            NAVILEARN PLATFORM
                        </p>

                        <h1 className="text-2xl sm:text-3xl font-black text-[#153b30] mt-1">
                            {pageTitles[activePage]}
                        </h1>
                    </div>

                    <div className="w-11 h-11 rounded-xl flex items-center justify-center
                        bg-emerald-100 border border-emerald-300/70
                        text-2xl">
                        {activePage === 'home' && '⌂'}
                        {activePage === 'profile' && '♙'}
                        {activePage === 'ranking' && '♛'}
                        {activePage === 'courses' && '▤'}
                    </div>

                </div>

                <div className="h-1 w-16 rounded-full bg-emerald-600 mt-3"></div>

            </div>

 
            <div key={activePage} className="page-content">

                {activePage === 'home' && (
                    <Home
                        currentUser={currentUser}
                        setActivePage={setActivePage}
                    />
                )}

                {activePage === 'profile' && (
                    <Profile
                        currentUser={currentUser}
                        logout={logout}
                    />
                )}

                {activePage === 'ranking' && (
                    <Leaderboard
                        topFive={topFive}
                        currentUser={currentUser}
                        currentUserPlace={currentUserPlace}
                    />
                )}

                {activePage === 'courses' && (
                    <Courses />
                )}

            </div>

 
            <BottomNav
                activePage={activePage}
                setActivePage={setActivePage}
            />

        </div>
    )
}

export default Course
