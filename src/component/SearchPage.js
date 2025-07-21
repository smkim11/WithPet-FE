import React, { useContext, useEffect, useState } from 'react'
import NaverMap from './NaverMap';
import Header from './Header';
import { UserContext } from '../context/UserContext';

export default function SearchPage() {
    const { user } = useContext(UserContext);
    const[keyword, setKeyWord] = useState('');
    const[items,setItems] = useState([]);

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
        });
    }

    // 카테고리 버튼으로 검색
    function handleCategoryClick(category) {
        const base = keyword.replace(/애견동반|식당/g, ''); // 중복 제거
        const fullKeyword = `${base} 애견동반 ${category}`;
        searchPlace(fullKeyword);
    }
    return (
        <div>
            <h1>검색</h1>
            <div>
                검색:<input type="text" onChange={(e)=>setKeyWord(e.target.value+'애견동반')}/>
                <button onClick={() => searchPlace(keyword+'식당')}>검색</button>
            </div>
            <NaverMap items={items}/>
            
            {
                items.map((c)=>(
                    <div key={c.title}>
                        {c.title}
                    </div>
                ))
            }
            <div className="button-container">
                <div className="submit-form" data-query="양식" onClick={()=>handleCategoryClick('양식')}>
                    <figure>
                        <img src="image/004-hamburger.png" alt="양식"/>
                        <figcaption>양식</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="한식" onClick={()=>handleCategoryClick('한식')}>
                    <figure>
                        <img src="image/006-bibimbap.png" alt="한식"/>
                        <figcaption>한식</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="일식" onClick={()=>handleCategoryClick('일식')}>
                    <figure>
                        <img src="image/005-sushi.png" alt="일식"/>
                        <figcaption>일식</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="중화요리" onClick={()=>handleCategoryClick('중화요리')}>
                    <figure>
                        <img src="image/007-buns-1.png" alt="중화요리"/>
                        <figcaption>중식</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="카페" onClick={()=>handleCategoryClick('카페')}>
                    <figure>
                        <img src="image/002-coffee-1.png" alt="카페"/>
                        <figcaption>카페</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="분식" onClick={()=>handleCategoryClick('분식')}>
                    <figure>
                        <img src="image/004-tteokbokki.png" alt="분식"/>
                        <figcaption>분식</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="해산물" onClick={()=>handleCategoryClick('해산물')}>
                    <figure>
                        <img src="image/005-lobster.png" alt="해산물"/>
                        <figcaption>해산물</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="베트남" onClick={()=>handleCategoryClick('베트남')}>
                    <figure>
                        <img src="image/002-noodle.png" alt="베트남"/>
                        <figcaption>베트남</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="태국" onClick={()=>handleCategoryClick('태국')}>
                    <figure>
                        <img src="image/001-thai-food.png" alt="태국"/>
                        <figcaption>태국</figcaption>
                    </figure>
                </div>
                <div className="submit-form" data-query="멕시코" onClick={()=>handleCategoryClick('멕시코')}>
                    <figure>
                        <img src="image/003-taco.png" alt="멕시코"/>
                        <figcaption>멕시코</figcaption>
                    </figure>
                </div>
            </div>
        </div>
    )
}
