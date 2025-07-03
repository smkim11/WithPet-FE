import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [id,setId] = useState('');
    const [pw,setPw] = useState('');
    const nav = useNavigate();

    function login(){
        fetch('http://localhost/login',{
            method:'POST',headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id:id,pw:pw}),credentials: 'include',
        }).then(async (res)=>{
            // res.text() -> 서버에서 응답하는 문자열 
            const text = await res.text();
            if(res.ok && text === '로그인 성공'){
                alert('로그인 성공');
                console.log('성공');
                nav('/MyPage');
            }else{
                alert('로그인 실패');
                setId('');
                setPw('');
            }
        })
    }
    return (
        <div>
            <h1>로그인</h1>
            <table>
                <tbody>
                <tr>
                    <th>아이디</th>
                    <td><input type="text" value={id} onChange={(e)=>{setId(e.target.value)}}/></td>
                </tr>
                </tbody>
                <tbody>
                <tr>
                    <th>비밀번호</th>
                    <td><input type="password" value={pw} onChange={(e)=>{setPw(e.target.value)}}/></td>
                </tr>
                </tbody>
            </table>
            <button onClick={login}>로그인</button>
        </div>
    )
}
