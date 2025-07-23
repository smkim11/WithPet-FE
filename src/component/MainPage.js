import React from 'react'
import Header from './Header'
import { Link } from 'react-router-dom'

export default function MainPage() {
    return (
        <div>
            <h1>메인페이지</h1>
            <Link to={'/SearchPage'}>위치찾기</Link>
        </div>
    )
}
