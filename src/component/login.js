import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
    const { setUser } = useContext(UserContext);
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const nav = useNavigate();

    function login(){
        fetch('http://localhost/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, pw })
        })
        .then(res => {
            if (!res.ok) throw new Error('로그인 실패');
            return fetch('http://localhost/session', {
            method: 'GET',
            credentials: 'include'
            });
        })
        .then(res => res.json())
        .then(data => {
            setUser(data); // 로그인 성공 → userContext 업데이트
            nav('/MainPage');
        })
        .catch(err => {
            alert(err.message);
        });
    };
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border-t-4 border-orange-400">
        <div className="flex justify-center mb-6">
          <img
            src="image/logo1.png"
            alt="With Pet 로고"
            className="w-40 h-40"
          />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          로그인
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">아이디</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <button
          onClick={login}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          로그인
        </button>

        <div className="text-center mt-4">
          <Link
            to="/SignUp"
            className="text-sm text-gray-600 hover:text-orange-500 transition"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
    )
}
