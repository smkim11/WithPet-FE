import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NaverMap({ items }) {
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

  // 마커에서 리뷰 클릭하면 가게정보를 DB에 저장하고 리뷰페이지로 이동
  function insertStoreSendReview(item){
        setTimeout(() => {
          const reviewBtn = document.getElementById("review-btn");
          if (reviewBtn) {
            const cleanTitle =(item.title).replace(/<[^>]*>?/gm, '');
            reviewBtn.addEventListener("click", () => {
              fetch("http://localhost/insertStore",{
                method:"post", headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                  title: cleanTitle,
                  category:
                        (item.category).includes('>')
                        ?(item.category).substring(0,(item.category).indexOf('>'))
                        :(item.category),    
                  address: item.address
                }),
            }).then((res)=>{
                  if(res.ok){ // 200
                      nav(`/Review/${cleanTitle}`); 
                  }else{ // 300, 400, 500
                  }
                });
              });
          }
        }, 0);
  }

  // 제목에 붙어있는 불필요한 문자들을 제거
  function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
  }   
  // items 바뀔 때마다 마커 다시 그림
  useEffect(() => {
    if (!window.naver || !mapInstance.current || !items || items.length === 0) return;

    // 새 마커 추가
    items.forEach((item,index) => {
      const mapx = parseFloat(item.mapx.substring(0, 3) + '.' + item.mapx.substring(3));
      const mapy = parseFloat(item.mapy.substring(0, 2) + '.' + item.mapy.substring(2));
      const position = new window.naver.maps.LatLng(mapy, mapx);

      const marker = new window.naver.maps.Marker({
        position:position,
        map: mapInstance.current,
        title: item.title,
      });
      const cleanTitle = stripHtmlTags(item.title);
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;">
            <strong>${cleanTitle}</strong><br/>
            <span>${item.category}</span><br/>
            <span>${item.address}</span><br/>
            <a href="${item.link}" target="_blank">상세정보</a><br/>
            <button id="review-btn">리뷰</button>
          </div>`,
      });

      
      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(mapInstance.current, marker);
        insertStoreSendReview(item);
      });

      markersRef.current.push(marker);

      // 검색 후 첫 마커는 바로 상세보기
      if (index === 0) {
          mapInstance.current.setCenter(position);
          infoWindow.open(mapInstance.current, marker);
          insertStoreSendReview(item);
      }
    });
  }, [items]);

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
