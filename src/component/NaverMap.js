import React, { useEffect, useRef } from "react";

export default function NaverMap({ items }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

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

  // items 바뀔 때마다 마커 다시 그림
  useEffect(() => {
    if (!window.naver || !mapInstance.current || !items || items.length === 0) return;

    // 이전 마커 삭제
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    items.forEach((item) => {
      const mapx = parseFloat(item.mapx.substring(0, 3) + '.' + item.mapx.substring(3));
      const mapy = parseFloat(item.mapy.substring(0, 2) + '.' + item.mapy.substring(2));
      const position = new window.naver.maps.LatLng(mapy, mapx);

      const marker = new window.naver.maps.Marker({
        position,
        map: mapInstance.current,
        title: item.title,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;">
            <strong>${item.title}</strong><br/>
            <span>${item.category}</span><br/>
            <span>${item.address}</span><br/>
            <a href="${item.link}" target="_blank">상세정보</a><br/>
          </div>`,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [items]);

  return React.createElement("div", {
    id: "map",
    ref: mapRef,
    style: { width: "100%", height: "500px", marginTop: "20px" },
  });
}
