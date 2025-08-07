import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function NaverMap({ items }) {
  const { user } = useContext(UserContext);
  const userId = user?.userId;
  const [storeId,setStoreId] = useState();
  const [bookmarkedStores, setBookmarkedStores] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const userLocationRef = useRef(null);

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
            userLocationRef.current = current;
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
  
  // 현재위치에서 가게까지 경로및 시간
  window.startRoute = async function(destLat, destLng) {
  const startLat = userLocationRef.current?.lat();
  const startLng = userLocationRef.current?.lng();

  if (!startLat || !startLng) {
    alert("현재 위치를 확인할 수 없습니다.");
    return;
  }

  const start = `${startLng},${startLat}`;
  const goal = `${destLng},${destLat}`;

  try {
    const res = await fetch(
      `http://localhost/directions?start=${start}&goal=${goal}`,
    );
    console.log("응답 상태코드:", res.status);  
    
    const data = await res.json();
    console.log("받은 경로 응답 데이터:", data);
    const path = data.route?.traoptimal?.[0]?.path;
    
    // 경로 좌표 배열로 변환
    const latLngPath = path.map(([lng, lat]) => new window.naver.maps.LatLng(lat, lng));

    // 기존 경로 있으면 제거
    if (routePolyline) {
      routePolyline.setMap(null);
    }

    const newLine = new window.naver.maps.Polyline({
      map: mapInstance.current,
      path: latLngPath,
      strokeColor: "#007AFF",
      strokeWeight: 6,
    });

    setRoutePolyline(newLine);

    // 경로 전체 보기
    const bounds = new window.naver.maps.LatLngBounds();
    latLngPath.forEach((latLng) => bounds.extend(latLng));
    mapInstance.current.fitBounds(bounds);

    // 거리/시간 정보 표시
    const routeData = data.route?.traoptimal?.[0];
    const summary = routeData?.summary;

    if (summary) {
      const distanceKm = (summary.distance / 1000).toFixed(1);
      const durationMin = Math.ceil(summary.duration / 60);
      const midIndex = Math.floor(latLngPath.length / 2);
      const midPoint = latLngPath[midIndex];

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:8px; font-size:14px;">
            🚗 거리: ${distanceKm}km<br/>
            ⏱ 시간: 약 ${durationMin}분
          </div>`,
        position: midPoint,
        pixelOffset: new window.naver.maps.Point(0, -20),
      });

      infoWindow.open(mapInstance.current);
    }

  } catch (error) {
    console.error("경로 요청 실패:", error);
    alert("경로 요청 중 오류가 발생했습니다.");
  }
};


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
      fetch('http://localhost/selectRatingAvg?storeId='+storeId)
          .then(res => res.json())
          .then(data => {
            // 받은 값이 배열이고 값이 null이 아니면 받아온 값 null 이면 ''이나 0
            const ratingData = Array.isArray(data) ? data[0] : data;
            const ratingAvg = ratingData?.avg ?? '';
            const cnt = ratingData?.cnt ?? 0;
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
              <span>${item.address}</span>
              ${ratingAvg === '' ? `<br/>` : 
                                // 평점평균 소수점 한자리까지만 
                `<br/><span>⭐ ${(ratingAvg).toFixed(1)}/5.0 (${cnt}명)</span><br/>`}
              <a href="${item.link}" target="_blank">상세정보</a><br/>
              <a href="/Review/${cleanTitle}">리뷰</a><br/>
              <span style="color:${isBookmarked ? 'gold' : 'gray'};">
                ${isBookmarked ? `<button onclick="deleteBookmark('${userId}',${storeId})">⭐ 즐겨찾기됨</button>` : 
                  `<button onclick="insertBookmark('${cleanTitle}',${userId})">즐겨찾기</button>`}
              </span>
              <button onclick="window.startRoute('${mapy}', '${mapx}')">🚗 길찾기</button>
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
