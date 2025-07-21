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
        <div>
            <h1>로그인</h1>
            <table>
                <tbody>
                <tr>
                    <th>아이디</th>
                                                                                 
                    <td><input type="text" value={id} onChange={(e)=>setId(e.target.value)}/></td>
                </tr>
                </tbody>
                <tbody>
                <tr>
                    <th>비밀번호</th>
                    <td><input type="password" value={pw} onChange={(e)=>setPw(e.target.value)}/></td>
                </tr>
                </tbody>
            </table>
            <button onClick={login}>로그인</button><Link to={'/SignUp'}>회원가입</Link>
        </div>
    )
}
