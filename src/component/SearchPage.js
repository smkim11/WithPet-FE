import React, { useState } from 'react'
import NaverMap from './NaverMap';

export default function SearchPage() {
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

    return (
        <div>
            <h1>검색</h1>
            <div>
                검색:<input type="text" onChange={(e)=>setKeyWord(e.target.value)}/>
            </div>
            <NaverMap items={items}/>
            <button onClick={() => searchPlace(keyword)}>검색</button>
            {
                items.map((c)=>(
                    <div key={c.title}>
                        {c.title}
                    </div>
                ))
            }
        </div>
    )
}
