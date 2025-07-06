import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Header() {
    const [user, setUser] = useState({});
    const nav= useNavigate();

    useEffect(() => {
        fetch('http://localhost/session', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('세션 없음');
        })
        .then(data => {
            console.log('세션 데이터:', data);
            setUser(data); // user 상태에 로그인 정보 저장
        })
    }, []);

    function logout(){
        fetch('http://localhost/logout' ,{method:'POST'})
        .then((res)=>{
            if(res.ok){
                alert('로그아웃')
                nav('/');
            }else{
                alert('실패');
            }
        })
    }
  return (
    <div>
        {user != null ? (
            <p>{user.name}님 환영합니다!</p>
        ) : (
            <p>ㅁㅁ</p>
        )}
        <button onClick={logout}>로그아웃</button>
    </div>
  )
}
