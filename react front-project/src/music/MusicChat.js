// src/music/MusicChat.js

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePlaylist } from "../context/PlaylistContext"; // 재생목록 관련 컨텍스트
import { useTrack } from "../context/TrackContext"; // 트랙 전역 상태 컨텍스트
import "../styles/common.css"; // 공통 스타일 CSS 불러오기

const MusicChat = () => {
  const { addTrack } = usePlaylist(); // 재생목록에 트랙을 추가하는 함수
  const { setAllTracks } = useTrack(); // 전체 트랙 데이터를 전역 상태로 저장하는 함수

  const [tracks, setTracks] = useState([]); // 현재 페이지까지 불러온 트랙들 저장
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 가져올 트랙이 있는지 여부
  const loaderRef = useRef(null); // Intersection Observer에서 사용할 DOM 참조

  // 인기 트랙 데이터 불러오기 함수
  const fetchTracks = useCallback(async () => {
    try {
      const limit = 30; // 페이지당 트랙 수
      const apiKey = process.env.REACT_APP_LASTFM_API_KEY; // 환경 변수에서 API 키 가져오기
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=${limit}&page=${page}`
      );
      const data = await response.json(); // JSON 형식으로 변환
      const newTracks = data.tracks.track; // 트랙 목록 추출

      setTracks((prev) => [...prev, ...newTracks]); // 기존 목록에 새 트랙 추가

      if (page * limit >= 200) setHasMore(false); // 최대 200개 트랙까지만 불러옴
    } catch (error) {
      console.error("Error fetching tracks:", error); // 에러 처리
    }
  }, [page]);

  // 📌 전역 상태로 트랙 저장
  useEffect(() => {
    setAllTracks(tracks); // fetch로 불러온 트랙을 전역 상태로 동기화
  }, [tracks, setAllTracks]);

  // 컴포넌트가 렌더링될 때 및 page 변경 시 트랙 데이터를 불러옴
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Intersection Observer 등록 → 무한스크롤 처리
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1); // 페이지 번호 증가
        }
      },
      { threshold: 1 } // 100% 보일 때 작동
    );
    const loader = loaderRef.current;
    if (loader) observer.observe(loader); // 옵저버 시작

    return () => loader && observer.unobserve(loader); // 언마운트 시 옵저버 제거
  }, [hasMore]);

  // 트랙 클릭 시 재생목록에 추가
  const handleTrackClick = (track) => {
    console.log("Track clicked:", track); // 디버깅용 로그
    addTrack({
      name: track.name,
      artist: { name: track.artist.name },
      url: track.url,
    });
  };

  return (
    <div className="flex-center" style={{ padding: "2rem" }}>
      <div className="card">
        <h2
          className="text-center text-bold"
          style={{ marginBottom: "1.5rem" }}
        >
          🎵 인기 차트
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tracks.map((track, index) => (
            <li key={`${track.name}-${index}`} className="list-item">
              <div>
                <strong>
                  {index + 1}. {track.name}
                </strong>{" "}
                - {track.artist.name}
              </div>
              <button
                onClick={() => handleTrackClick(track)} // 클릭하면 트랙 추가
                className="button"
              >
                재생
              </button>
            </li>
          ))}
        </ul>
        {/* 스크롤 마지막 부분에 도달 시 로딩 */}
        {hasMore && (
          <div ref={loaderRef} className="loader">
            불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicChat;
