import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function MainPage() {
    const[bookmarkRank,setBookmarkRank] = useState([]);
    const[reviewRank,setReviewRank]=useState([]);

    useEffect(()=>{
            fetch('http://localhost/selectStoreRankByBookmark')
            .then((res)=>(res.json()))
            .then((data)=>{setBookmarkRank(data)})
    },[])

    useEffect(()=>{
            fetch('http://localhost/selectStoreRankByReview')
            .then((res)=>(res.json()))
            .then((data)=>{setReviewRank(data)})
    },[])

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">메인페이지</h1>

                <div className="flex flex-col md:flex-row md:space-x-12 space-y-8 md:space-y-0">
                {/* 즐겨찾기 순위 */}
                <section className="flex-1 bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4 text-orange-500 border-b-2 border-orange-400 pb-2">
                    즐겨찾기 순위
                    </h3>
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-2 w-20">순위</th>
                        <th className="px-4 py-2">이름</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookmarkRank.map((item, idx) => (
                        <tr
                            key={idx}
                            className="even:bg-gray-100 hover:bg-orange-100 transition cursor-pointer"
                        >
                            <td className="px-4 py-2">{item.ranking}</td>
                            <td className="px-4 py-2 truncate">{item.title}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </section>

                {/* 리뷰 순위 */}
                <section className="flex-1 bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4 text-orange-500 border-b-2 border-orange-400 pb-2">
                    리뷰 순위
                    </h3>
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-2 w-20">순위</th>
                        <th className="px-4 py-2">이름</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviewRank.map((item, idx) => (
                        <tr
                            key={idx}
                            className="even:bg-gray-100 hover:bg-orange-100 transition cursor-pointer"
                        >
                            <td className="px-4 py-2">{item.ranking}</td>
                            <td className="px-4 py-2 truncate">{item.title}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </section>
                </div>

                <div className="text-center mt-12">
                <Link
                    to={'/SearchPage'}
                    className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-8 rounded-lg transition-colors"
                >
                    위치찾기
                </Link>
                </div>
            </div>
        </div>
    )
}
