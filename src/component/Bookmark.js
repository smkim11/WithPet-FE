import React from 'react'
import { useParams } from 'react-router-dom'

export default function Bookmark() {
    const{userId} = useParams();
    return (
        <div>
            <h1>즐겨찾기</h1>
        </div>
    )
}
