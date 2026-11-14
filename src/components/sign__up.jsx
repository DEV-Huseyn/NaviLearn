import { Link, useNavigate } from 'react-router'
import React, { useState } from 'react'
import NaviLogo from '../gift/NaviLearnLogo.gif'
import axios from 'axios'
// import { Api } from '../api/users'
const Sign__up = ({ setIsLoggedIn }) => {

    const navigate = useNavigate()

    const [inpName, setInpName] = useState('')
    const [inpEmail, setInpEmail] = useState('')
    const [inpPassword, setInpPassword] = useState('')

// const API = "http://dcn481.dcn.tj/Novilearn/api"

const API = "https://dcn481.dcn.tj/Novilearn/api";

const userSearch = async (e) => {
    e.preventDefault()

    try {
        const response = await axios.post(
            `${API}/auth/register.php`,
            {
                name: inpName.trim(),
                email: inpEmail.trim(),
                password: inpPassword
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        )

        const result = response.data

        console.log('Register response:', result)
        if (result.success) {
        
            alert("Регистрация прошла успешно!")
        
            setInpName("")
            setInpEmail("")
            setInpPassword("")
        
            if (result.data?.token) {
                localStorage.setItem("token", result.data.token)
                localStorage.setItem(
                    "userId",
                    result.data.user?.id || result.data.id
                )
              
                setIsLoggedIn(true)
                navigate("/course")
            } else {
                navigate("/sign__in")
            }
          
        } else {
            alert(result.message || "Ошибка регистрации!")
        }
    } catch (error) {
        console.error(
            "Register error:",
            error.response?.data || error.message
        )

        alert(
            error.response?.data?.message ||
            "Ошибка подключения к серверу!"
        )
    }
}

return (
    <>

      <div className="mx-auto mt-8 sm:my-12 lg:my-1.5
        rounded-3xl sm:rounded-4xl
        py-5 sm:py-7 lg:py-8
        px-3 sm:px-5
        w-[94%] sm:w-[90%] lg:w-[850px]
        min-h-[600px] lg:min-h-[700px]
        bg-gradient-to-br from-[#d1fae5] via-[#a7f3d0] to-[#ccfbf1]
        border border-emerald-100/70
        shadow-[0_25px_80px_-15px_rgba(6,78,59,0.35),0_10px_30px_rgba(0,0,0,0.20),inset_0_1px_2px_rgba(255,255,255,0.6)]">

        <img
          className="w-[110px] sm:w-[130px] lg:w-[150px] mx-auto"
          src={NaviLogo}
          alt="LOGO"
        />

        <h1 className="bg-gradient-to-r from-emerald-700 to-teal-800
          bg-clip-text text-transparent
          text-2xl sm:text-3xl lg:text-4xl
          font-bold mx-auto text-center
          mt-2.5 mb-5 sm:mb-7">
          Регистрация
        </h1>

        <div className="w-full max-w-[420px] mx-auto
          p-6 sm:p-8 

          rounded-[28px]
          bg-[#101c1b]/90
          backdrop-blur-2xl
          border border-emerald-500/10
          shadow-[0_20px_70px_rgba(0,0,0,0.35),0_0_35px_rgba(16,185,129,0.10)]">

          <h2 className="text-white text-xl font-semibold text-center mb-2">
            Создай аккаунт
          </h2>

          <p className="text-slate-400 text-sm text-center mb-7">
            Начни свой путь обучения вместе с NaviLearn
          </p>

          <form onSubmit={userSearch} className="flex flex-col gap-5">

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300 font-medium">
                Имя пользователя
              </label>
              <input
              value={inpName}
              onChange={(e)=> setInpName(e.target.value)}
                type="text"
                placeholder="Введите имя"
                className="w-full h-12 px-4 rounded-xl
                  bg-[#0a1413] border border-emerald-900/60
                  text-white placeholder-slate-500
                  outline-none transition duration-300
                  focus:border-emerald-400
                  focus:ring-4 focus:ring-emerald-500/10
                  hover:border-emerald-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300 font-medium">
                Электронная почта
              </label>
              <input
              value={inpEmail}
              onChange={(e)=> setInpEmail(e.target.value)}  
              type="email"
                placeholder="example@gmail.com"
                className="w-full h-12 px-4 rounded-xl
                  bg-[#0a1413] border border-emerald-900/60
                  text-white placeholder-slate-500
                  outline-none transition duration-300
                  focus:border-emerald-400
                  focus:ring-4 focus:ring-emerald-500/10
                  hover:border-emerald-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300 font-medium">
                Пароль
              </label>
              <input
              value={inpPassword}
              onChange={(e)=> setInpPassword(e.target.value)}
                type="password"
                placeholder="Введите пароль"
                className="w-full h-12 px-4 rounded-xl
                  bg-[#0a1413] border border-emerald-900/60
                  text-white placeholder-slate-500
                  outline-none transition duration-300
                  focus:border-emerald-400
                  focus:ring-4 focus:ring-emerald-500/10
                  hover:border-emerald-700"
              />
            </div>

            <button
                type="submit"
              className="cursor-pointer relative overflow-hidden w-full h-12 mt-2
                rounded-xl
                bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
                text-white font-semibold tracking-wide
                shadow-[0_8px_25px_rgba(16,185,129,0.25)]
                hover:shadow-[0_8px_35px_rgba(20,184,166,0.4)]
                hover:-translate-y-0.5
                active:translate-y-0 active:scale-[0.98]
                transition-all duration-300">
              Зарегистрироваться
            </button>

            <p className="text-center text-sm text-slate-400">
              Уже есть аккаунт?
              <Link
            to="/sign__in"
            className="ml-1 cursor-pointer text-emerald-400 hover:text-cyan-300 transition-colors">
                    Войти
            </Link>
            </p>

          </form>
        </div>
      </div>
    </>
  )
}

export default Sign__up
