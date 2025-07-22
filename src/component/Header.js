import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
export default function Header() {
    const {user, setUser, loading} = useContext(UserContext);
    const nav= useNavigate();
    const location = useLocation();

    // 로그아웃상태면 안보이게
    if (!user) return null;
    // 로딩중일땐 안보이게
    if (loading) return null;
    // 로그인창과 회원가입창에선 헤더 숨김
    if (location.pathname === '/') return null; 
    if (location.pathname === '/SignUp') return null;

    function logout(){
        fetch('http://localhost/logout' ,{method:'POST', credentials: 'include'})
        .then((res)=>{
            if(res.ok){
                alert('로그아웃')
                setUser(null);
                nav('/');
            }else{
                alert('실패');
            }
        })
    }

    return (
        
        <div>
            {user?.name}님 환영합니다!
            <Link to={'/MyPage/'+user.userId}>마이페이지</Link> &nbsp;
            <Link to={'/Bookmark/'+user.userId}>즐겨찾기</Link><br/>
            <button onClick={logout}>로그아웃</button>
        </div>
    )
}
