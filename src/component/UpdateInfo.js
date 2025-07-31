import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateInfo() {
    const{userId} = useParams();
    const[userOne,setUserOne] = useState({});

    const nav = useNavigate();
    
    useEffect(()=>{
        fetch('http://localhost/myPage/'+userId)
        .then((res)=>(res.json()))
        .then((data)=>{setUserOne(data.user)})
    },[userId])

    function edit(){
        fetch('http://localhost/updateMyPage', {
            method:"PATCH", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({userId: userId, id: userOne.id, name:userOne.name, email:userOne.email,birth:userOne.birth}),
        })
        .then((res)=>{
            if(res.ok){
                nav('/MyPage/'+userId);
            }else{
                alert('수정실패')
            }
        })
    }
   
    return (
        <div>
            <h1>개인정보수정</h1>
            <table>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td><input type="text" name="name" value={userOne.name} onChange={(e)=>(setUserOne({...userOne,name:e.target.value}))}/></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>생년월일</th>
                        <td><input type="date" name="birth" value={userOne.birth} onChange={(e)=>(setUserOne({...userOne,birth:e.target.value}))}/></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>이메일</th>
                        <td><input type="text" name="email" value={userOne.email} onChange={(e)=>(setUserOne({...userOne,email:e.target.value}))}/></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={edit}>수정</button>
        </div>
    )
}
