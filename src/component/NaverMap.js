import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function NaverMap({ items }) {
  const { user } = useContext(UserContext);
  const userId = user?.userId;
  const [storeId,setStoreId] = useState();
  const [bookmarkedStores, setBookmarkedStores] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const nav = useNavigate();

  // 네이버 지도 API 로드 및 지도 생성
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=881a9cbawu&submodules=geocoder";
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(37.5666805, 126.9784147),
          zoom: 15,
        });

        map.setCursor("pointer");
        mapInstance.current = map;

        // 현재 위치
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const current = new window.naver.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            map.setCenter(current);

            new window.naver.maps.Marker({
              position: current,
              map,
              title: "현재 위치",
            });

            new window.naver.maps.InfoWindow({
              content: "<div style='padding:10px;'>현재 위치</div>",
            }).open(map, new window.naver.maps.Marker({ position: current }));
          });
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
    }, []);
    
  // 로그인한 사용자가 즐겨찾기한 가게번호 리스트
  useEffect(() => {
  fetch('http://localhost/selectStoreIdByUserId?userId='+userId)
    .then(res => res.json())
    .then(data => {
      console.log("받은 데이터:", data);
      setBookmarkedStores(data)}); // [1, 2, 3, 4] 형태
  }, [userId]);

  // 가게 즐겨찾기 저장
  window.insertBookmark=function(title,userId){
    fetch('http://localhost/selectStoreId?title='+title,{method: "get"})
    .then((res)=>(res.json()))
    .then(data=>{
        fetch("http://localhost/insertBookmark",{
        method:"post", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({userId:userId,storeId:data})
        }).then((res)=>{
          if(res.ok){
            // 등록 후 새로고침
            window.location.reload();
          }else{
              alert('등록실패');
          }
        });
        {setStoreId(data)}

    })
  }

  // 즐겨찾기 삭제
  window.deleteBookmark=function(userId,storeId){
        if(window.confirm('삭제하시겠습니까?')){
            fetch('http://localhost/deleteBookmark', {method:'DELETE',
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({userId:userId,storeId:storeId})})
            .then((res)=>{
                if(res.ok){
                  // 삭제 후 새로고침
                  window.location.reload();
                }else{
                    alert('삭제실패');
                }
            })
        }else{
            alert('삭제취소');
        }
    }

  // 제목에 붙어있는 불필요한 문자들을 제거
  function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
  }   
  // items 바뀔 때마다 마커 다시 그림
  useEffect(() => {
  if (!window.naver || !mapInstance.current || !items || items.length === 0) return;

  markersRef.current.forEach(marker => marker.setMap(null));
  markersRef.current = [];

  items.forEach((item, index) => {
    const mapx = parseFloat(item.mapx.substring(0, 3) + '.' + item.mapx.substring(3));
    const mapy = parseFloat(item.mapy.substring(0, 2) + '.' + item.mapy.substring(2));
    const position = new window.naver.maps.LatLng(mapy, mapx);
    const cleanTitle = stripHtmlTags(item.title);

    // 먼저 storeId 조회
    fetch(`http://localhost/selectStoreId?title=${cleanTitle}`)
      .then(res => res.json())
      .then(storeId => {
        const isBookmarked = bookmarkedStores.includes(storeId);

        // 마커 아이콘 조건
        const markerIcon = isBookmarked
          ? 'https://example.com/star-icon.png'
          : null; // 기본 마커

        const marker = new window.naver.maps.Marker({
          position: position,
          map: mapInstance.current,
          title: cleanTitle,
          icon: markerIcon,
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding:10px;">
              <strong>${cleanTitle}</strong><br/>
              <span>${item.category}</span><br/>
              <span>${item.address}</span><br/>
              <a href="${item.link}" target="_blank">상세정보</a><br/>
              <a href="/Review/${cleanTitle}">리뷰</a><br/>
              <span style="color:${isBookmarked ? 'gold' : 'gray'};">
                ${isBookmarked ? `<button onclick="deleteBookmark('${userId}',${storeId})">⭐ 즐겨찾기됨</button>` : 
                  `<button onclick="insertBookmark('${cleanTitle}',${userId})">즐겨찾기</button>`}
              </span>
            </div>`,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindow.open(mapInstance.current, marker);
        });

        // 첫 번째 마커 자동 열기
        if (index === 0) {
          mapInstance.current.setCenter(position);
          infoWindow.open(mapInstance.current, marker);
        }

        markersRef.current.push(marker);
      });
  });
}, [items, bookmarkedStores]);

  // 검색하면 첫번째 항목으로 지도 이동
  if (items.length > 0) {
    const firstItem = items[0];
    const mapx = parseFloat(firstItem.mapx.substring(0, 3) + '.' + firstItem.mapx.substring(3));
    const mapy = parseFloat(firstItem.mapy.substring(0, 2) + '.' + firstItem.mapy.substring(2));
    const position = new window.naver.maps.LatLng(mapy, mapx);

    mapInstance.current.setCenter(position);
  }

  return React.createElement("div", {
    id: "map",
    ref: mapRef,
    style: { width: "100%", height: "500px", marginTop: "20px" },
  });
}
