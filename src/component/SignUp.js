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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border-t-4 border-orange-400">
                
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    회원가입
                </h1>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">아이디</label>
                    <input
                        type="text"
                        name="id"
                        onBlur={(e) => setUser({ ...user, id: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="아이디를 입력하세요"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">비밀번호</label>
                    <input
                        type="password"
                        onChange={(e) => setUser({ ...user, pw: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">이름</label>
                    <input
                        type="text"
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="이름을 입력하세요"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">생년월일</label>
                    <input
                        type="date"
                        onChange={(e) => setUser({ ...user, birth: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">이메일</label>
                    <input
                        type="email"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="이메일을 입력하세요"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">반려견 이름</label>
                    <input
                        type="text"
                        onChange={(e) => setUser({ ...user, petName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="반려견 이름을 입력하세요"
                    />
                </div>

                <button
                    onClick={signUp}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                    가입
                </button>
            </div>
        </div>
    )
}
