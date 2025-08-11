import React, { useContext, useEffect, useState } from 'react'
import NaverMap from './NaverMap';
import { UserContext } from '../context/UserContext';

export default function SearchPage() {
    const { user } = useContext(UserContext);
    const[keyword, setKeyWord] = useState('');
    const[items,setItems] = useState([]);
    // 검색시 검색된 가게정보 저장
    function searchPlace(keyword) {
        fetch(`http://localhost/search/${encodeURIComponent(keyword)}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log("검색 결과:", data);
            setItems(data.items)
            // data.items를 활용하여 화면에 출력
            
            // 검색된 가게정보들 반복문으로 저장
            for(let i=0;i<data.items.length;i++){
                const cleanTitle =(data.items[i].title).replace(/<[^>]*>?/gm, '');
                fetch("http://localhost/insertStore",{
                method:"post", headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                  title: cleanTitle,
                  category:
                        (data.items[i].category).includes('>')
                        ?(data.items[i].category).substring((data.items[i].category).lastIndexOf('>')+1)
                        :(data.items[i].category),    
                  address: data.items[i].address,
                  link:data.items[i].link
                }),
            })
            }
            
        });
    }

    // 카테고리 버튼으로 검색
    function handleCategoryClick(category) {
        const base = keyword.replace(/애견동반|식당/g, ''); // 중복 제거
        const fullKeyword = `${base} 애견동반 ${category}`;
        searchPlace(fullKeyword);
    }
    return (
        <div className="flex justify-center bg-gray-50 pt-3 pb-2">
            <div className="w-full max-w-6xl px-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">검색</h1>

                <div className="flex justify-center mb-6 space-x-3">
                    <input
                        type="text"
                        onChange={(e) => setKeyWord(e.target.value + ' 애견동반')}
                        placeholder="검색어를 입력하세요"
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                        onClick={() => searchPlace(keyword + ' 식당')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-lg transition"
                    >
                        검색
                    </button>
                </div>

                <NaverMap items={items} />

                {/* 화면작아지면 가로스크롤 */}
                <div className="mt-8 overflow-x-auto max-w-5xl mx-auto">
                    <div className="flex space-x-4">
                        {[
                            { key: '양식', img: 'image/004-hamburger.png', label: '양식' },
                            { key: '한식', img: 'image/006-bibimbap.png', label: '한식' },
                            { key: '일식', img: 'image/005-sushi.png', label: '일식' },
                            { key: '중화요리', img: 'image/007-buns-1.png', label: '중식' },
                            { key: '카페', img: 'image/002-coffee-1.png', label: '카페' },
                            { key: '분식', img: 'image/004-tteokbokki.png', label: '분식' },
                            { key: '해산물', img: 'image/005-lobster.png', label: '해산물' },
                            { key: '베트남', img: 'image/002-noodle.png', label: '베트남' },
                            { key: '태국', img: 'image/001-thai-food.png', label: '태국' },
                            { key: '멕시코', img: 'image/003-taco.png', label: '멕시코' },
                        ].map(({ key, img, label }) => (
                            <button
                                key={key}
                                onClick={() => handleCategoryClick(key)}
                                className="flex flex-col items-center bg-white p-3 rounded-lg shadow cursor-pointer hover:shadow-lg transition min-w-[80px]"
                                type="button"
                            >
                                <img src={img} alt={label} className="w-12 h-12 mb-1" />
                                <span className="text-sm text-gray-700 whitespace-nowrap">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
