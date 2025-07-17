import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [user,setUser] = useState({});
    const nav = useNavigate();

    useEffect(()=>{
        fetch('http://localhost/findSameId/'+user.id,{method: "get"})
        .then(async (res)=>{
            // res.text() -> 서버에서 응답하는 문자열 
            const text = await res.text();
            if(text === 'true'){
                alert('이미존재하는 아이디입니다.');
            }else{
                
            }
        })
    },[user.id]);

    function signUp(){
        fetch('http://localhost/signup',{
            method:"post", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id : user.id, pw : user.pw, name:user.name,
                                birth:user.birth, email:user.email, petName:user.petName}),
        }).then((res)=>{
            if(res.ok){
                alert('가입성공');
                nav('/');
            }else{
                alert('가입실패');
            }

        })
    }

    

    return (
    <div>
        <h1>회원가입</h1>
        <table>
            <tbody>
                <tr>
                    <th>아이디</th>
                    <td><input type="text" name="id" onBlur={(e)=>(setUser({...user,id:e.target.value}))}/></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th>비밀번호</th>
                    <td><input type="password" onChange={(e)=>(setUser({...user,pw:e.target.value}))}/></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th>이름</th>
                    <td><input type="text" onChange={(e)=>(setUser({...user,name:e.target.value}))}/></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th>생년월일</th>
                    <td><input type="date" onChange={(e)=>(setUser({...user,birth:e.target.value}))}/></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th>이메일</th>
                    <td><input type="text" onChange={(e)=>(setUser({...user,email:e.target.value}))}/></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th>반려견 이름</th>
                    <td><input type="text" onChange={(e)=>(setUser({...user,petName:e.target.value}))}/></td>
                </tr>
            </tbody>
        </table>
        <button onClick={signUp}>가입</button>
    </div>
    )
}
