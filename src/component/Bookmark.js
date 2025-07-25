import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Bookmark() {
    const{userId} = useParams();
    const[storeList,setStoreList] = useState([]);

    useEffect(()=>{
        fetch('http://localhost/bookmarkList?userId='+userId)
        .then((res)=>(res.json()))
        .then((data)=>{setStoreList(data)})
    },[userId])
    return (
        <div>
            <h1>즐겨찾기</h1>
            <table>
                <tbody>
                    <tr>
                        <th>가게</th>
                        <th>종류</th>
                        <th>위치</th>
                    </tr>
                </tbody>
                <tbody>
                    {
                        storeList.map((list)=>(
                            <tr>
                                <td>{list.title}</td>
                                <td>{list.category}</td>
                                <td>{list.address}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
