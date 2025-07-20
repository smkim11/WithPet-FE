import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [user,setUser] = useState({id:'',pw:''});
    const nav = useNavigate();

    function login(){
        fetch('http://localhost/login',{
            method:'POST',headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id:user.id,pw:user.pw}),credentials: 'include',
        }).then(async (res)=>{
            // res.text() -> 서버에서 응답하는 문자열 
            const text = await res.text();
            if(res.ok && text === '로그인 성공'){
                console.log('성공');
                nav('/MainPage');
            }else{
                alert('로그인 실패');
                
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
                                                                                 {/*기존값 유지하고 변경값만 덮어쓴다 */}
                    <td><input type="text" value={user.id} onChange={(e)=>{setUser({...user,id:e.target.value})}}/></td>
                </tr>
                </tbody>
                <tbody>
                <tr>
                    <th>비밀번호</th>
                    <td><input type="password" value={user.pw} onChange={(e)=>{setUser({...user,pw:e.target.value})}}/></td>
                </tr>
                </tbody>
            </table>
            <button onClick={login}>로그인</button><Link to={'/SignUp'}>회원가입</Link>
        </div>
    )
}
