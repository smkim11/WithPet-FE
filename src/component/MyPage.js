import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useParams } from 'react-router-dom'

export default function MyPage() {
    const{userId} = useParams();
    const[userOne,setUserOne] = useState({});
    const[petOne,setPetOne]=useState({});

    useEffect(()=>{
        fetch('http://localhost/myPage/'+userId)
        .then((res)=>(res.json()))
        .then((data)=>{setUserOne(data.user);setPetOne(data.pet)})
    },[userId])
    
    return (
        <div>
            <h1>마이페이지</h1>
            <table>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td>{userOne.name}</td>
                    </tr>
                </tbody>
                {
                    petOne != null ? 
                    <>
                        <tbody>
                            <tr>
                                <th>반려견</th>
                                <td>{petOne.petName}</td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <th>아이디</th>
                                <td>{userOne.id}</td>
                            </tr>
                        </tbody>
                    </>
                        :
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>{userOne.id}</td>
                        </tr>
                    </tbody>
                }
                <tbody>
                    <tr>
                        <th>생년월일</th>
                        <td>{userOne.birth}</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>이메일</th>
                        <td>{userOne.email}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
 