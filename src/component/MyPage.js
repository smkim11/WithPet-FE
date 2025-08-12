import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

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
        <div className="flex justify-center bg-gray-50 pt-16 pb-8">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border-t-4 border-orange-400">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    마이페이지
                </h1>

                <div className="space-y-6">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            <tr className="border-b">
                                <th className="px-4 py-3 w-24 bg-gray-800 text-white">이름</th>
                                <td className="px-4 py-3">{userOne.name}</td>
                            </tr>
                            {petOne ? (
                                <>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 bg-gray-800 text-white">반려견</th>
                                        <td className="px-4 py-3">{petOne.petName}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 bg-gray-800 text-white">아이디</th>
                                        <td className="px-4 py-3">{userOne.id}</td>
                                    </tr>
                                </>
                            ) : (
                                <tr className="border-b">
                                    <th className="px-4 py-3 bg-gray-800 text-white">아이디</th>
                                    <td className="px-4 py-3">{userOne.id}</td>
                                </tr>
                            )}
                            <tr className="border-b">
                                <th className="px-4 py-3 bg-gray-800 text-white">생년월일</th>
                                <td className="px-4 py-3">{userOne.birth}</td>
                            </tr>
                            <tr>
                                <th className="px-4 py-3 bg-gray-800 text-white">이메일</th>
                                <td className="px-4 py-3">{userOne.email}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="text-center mt-6">
                        <Link
                            to={`/UpdateInfo/${userId}`}
                            className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            개인정보 수정
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
 