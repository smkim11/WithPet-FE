import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Bookmark() {
    const{userId} = useParams();
    const[store,setStore] = useState({});

    useEffect(()=>{
        fetch('http://localhost/bookmarkList?userId='+userId)
        .then((res)=>(res.json()))
        .then((data)=>{setStore(data)})
    },[userId])
    return (
        <div>
            <h1>즐겨찾기</h1>
        </div>
    )
}
