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

    function deleteBookmark(userId,storeId){
        if(window.confirm('삭제하시겠습니까?')){
            fetch('http://localhost/deleteBookmark', {method:'DELETE',
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({userId:userId,storeId:storeId})})
            .then((res)=>{
                if(res.ok){
                  // 삭제 후 새로고침
                  window.location.reload();
                }else{
                    alert('삭제실패');
                }
            })
        }else{
            alert('삭제취소');
        }
    }

    return (
        <div>
            <h1>즐겨찾기</h1>
            <table>
                <tbody>
                    <tr>
                        <th>가게</th>
                        <th>종류</th>
                        <th>위치</th>
                        <th></th>
                    </tr>
                </tbody>
                <tbody>
                    {
                        storeList.map((list)=>(
                            <tr>
                                <td><a href={list.link}>{list.title}</a></td>
                                <td>{list.category}</td>
                                <td>{list.address}</td>
                                <td><button onClick={()=>deleteBookmark(userId,list.storeId)}>삭제</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
