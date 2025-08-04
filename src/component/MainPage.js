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
        <div>
            <h1>메인페이지</h1>
                <h3>즐겨찾기 순위</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>순위</th>
                            <th>이름</th>
                        </tr>
                    </tbody>
                    {
                        bookmarkRank.map((list)=>(
                            <tbody>
                                <tr>
                                    <td>{list.ranking}</td>
                                    <td>{list.title}</td>
                                </tr>
                            </tbody>
                    ))}
                </table>

                <h3>리뷰 순위</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>순위</th>
                            <th>이름</th>
                        </tr>
                    </tbody>
                    {
                        reviewRank.map((list)=>(
                            <tbody>
                                <tr>
                                    <td>{list.ranking}</td>
                                    <td>{list.title}</td>
                                </tr>
                            </tbody>
                    ))}
                </table>
            <Link to={'/SearchPage'}>위치찾기</Link>
        </div>
    )
}
