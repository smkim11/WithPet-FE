import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useParams } from 'react-router-dom'

export default function Review() {
    const title = useParams({});
    const [user, setUser] = useState({});

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
    return (
        <div>
            <Header/>
            <h1>리뷰</h1>
            <table>
                <tbody>
                    <tr>
                        <th>가게</th>
                        <td><input type="text" value={title.title} readOnly/></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td><input type="text" value={user.name} readOnly/></td>
                    </tr>
                </tbody>
            </table>
        
        </div>
    )
}
