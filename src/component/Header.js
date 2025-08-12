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
        
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      <div>
        <Link to="/MainPage">
          <img
            src="/image/logo1.png"
            alt="With Pet 로고"
            className="h-12 cursor-pointer w-25 h-20"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-gray-800">
          <span className="block text-lg font-semibold mb-1 border-b-2 border-orange-400 inline-block pb-1">
            {user?.name}님 환영합니다!
          </span>
          <div className="flex space-x-6 text-sm text-gray-600">
            <Link
              to={`/MyPage/${user.userId}`}
              className="hover:text-orange-500 transition"
            >
              마이페이지
            </Link>
            <Link
              to={`/Bookmark/${user.userId}`}
              className="hover:text-orange-500 transition"
            >
              즐겨찾기
            </Link>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md shadow transition"
        >
          로그아웃
        </button>
      </div>
    </header>
    )
}
