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
        <div className="flex justify-center bg-gray-50 pt-16 pb-8">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border-t-4 border-orange-400">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    개인정보 수정
                </h1>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={userOne.name || ""}
                            onChange={(e) => setUserOne({ ...userOne, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">생년월일</label>
                        <input
                            type="date"
                            name="birth"
                            value={userOne.birth || ""}
                            onChange={(e) => setUserOne({ ...userOne, birth: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={userOne.email || ""}
                            onChange={(e) => setUserOne({ ...userOne, email: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={edit}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition"
                        >
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
