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
        <div className="flex justify-center bg-gray-50 pt-10 pb-4">
            <div className="w-full max-w-6xl px-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    즐겨찾기
                </h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-3">가게</th>
                                <th className="px-4 py-3">종류</th>
                                <th className="px-4 py-3">위치</th>
                                <th className="px-4 py-3 w-24"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {storeList.map((list, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-orange-100 transition cursor-pointer"
                                >
                                    <td className="px-4 py-3">
                                        <a
                                            href={list.link}
                                            className="text-orange-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {list.title}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">{list.category}</td>
                                    <td className="px-4 py-3">{list.address}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => deleteBookmark(userId, list.storeId)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
