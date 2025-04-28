import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePlaylist } from "../context/PlaylistContext"; // PlaylistContext에서 hook을 가져옴
import { FaSearch } from "react-icons/fa"; // 검색 아이콘을 위한 react-icons에서 FaSearch 가져옴
import "../styles/common.css"; // 공통 스타일시트를 가져옴

const API_KEY = "";

// 트랙 항목을 렌더링하는 컴포넌트
const TrackItem = ({ track, onAdd }) => {
  return (
    <li className="list-item" style={{ marginBottom: "1rem" }}>
      <div className="item-info">
        <div className="item-title">{track.name}</div> {/* 트랙 제목 */}
        <div className="item-subtext">아티스트: {track.artist.name}</div>{" "}
        {/* 트랙 아티스트 */}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation(); // 클릭 시 부모 엘리먼트로 이벤트가 전파되지 않도록 함
          onAdd(track); // 트랙을 재생목록에 추가하는 함수 호출
        }}
        className="button"
      >
        재생 {/* 버튼 텍스트 */}
      </button>
    </li>
  );
};

// 아티스트 트랙 검색 페이지
const MusicArtist = () => {
  const [inputValue, setInputValue] = useState(""); // 입력값 상태
  const [tracks, setTracks] = useState([]); // 트랙 목록 상태
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터가 있는지 여부 상태
  const { addTrack, setLastClickedTrack } = usePlaylist(); // PlaylistContext에서 재생목록 관리 함수 가져옴

  const loaderRef = useRef(null); // IntersectionObserver를 위한 ref

  // 트랙을 가져오는 비동기 함수
  const fetchTracks = useCallback(async (currentArtist, currentPage) => {
    if (!currentArtist) return; // 아티스트 이름이 없으면 반환
    try {
      // Last.fm API를 이용해 아티스트의 트랙을 요청
      const API_URL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${currentArtist}&api_key=${API_KEY}&format=json&limit=20&page=${currentPage}`;
      const res = await fetch(API_URL);
      const data = await res.json();

      const newTracks = data?.toptracks?.track || []; // 트랙 목록을 추출

      // 가져온 트랙이 없거나, 20개 미만일 경우 더 이상 데이터를 가져오지 않도록 설정
      if (newTracks.length === 0 || newTracks.length < 20) {
        setHasMore(false);
      }

      // 기존 트랙 목록에 새로운 트랙 추가
      setTracks((prev) => [...prev, ...newTracks]);
    } catch (err) {
      console.error("API 호출 실패:", err); // API 호출 실패 시 에러 로그 출력
      setHasMore(false); // 에러 발생 시 더 이상 데이터 가져오지 않도록 설정
    }
  }, []);

  // 검색 버튼을 클릭하거나 Enter 키를 눌렀을 때 호출되는 함수
  const handleSearch = () => {
    const trimmed = inputValue.trim(); // 입력값의 앞뒤 공백을 제거
    if (!trimmed) return; // 입력값이 없으면 반환
    setTracks([]); // 기존 트랙 목록 초기화
    setPage(1); // 페이지 번호 초기화
    setHasMore(true); // 데이터 더 가져오기 상태 초기화
    fetchTracks(trimmed, 1); // 아티스트의 트랙을 첫 페이지부터 가져옴
  };

  // IntersectionObserver로 무한스크롤을 처리하는 함수
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        setPage((prev) => prev + 1); // 페이지 번호를 증가시켜서 새로운 데이터를 가져오도록 설정
      }
    },
    [hasMore] // hasMore 값이 변경될 때마다 useCallback이 호출되도록 설정
  );

  // 페이지가 변경될 때마다 트랙을 가져오는 함수 호출
  useEffect(() => {
    fetchTracks(inputValue, page);
  }, [inputValue, page, fetchTracks]); // inputValue와 page가 변경될 때마다 호출

  // IntersectionObserver 설정
  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0, // 100% 보일 때마다 호출
    });

    observer.observe(target); // ref가 지정된 요소를 관찰

    return () => {
      observer.unobserve(target); // 컴포넌트가 언마운트되거나 observer가 필요 없을 때 정리
    };
  }, [handleObserver]); // handleObserver가 변경될 때마다 observer를 새로 설정

  // 재생목록에 트랙을 추가하는 함수
  const handleAddToPlaylist = (track) => {
    // alert(`${track.name} 트랙이 재생목록에 추가되었습니다.`);  // 알림창
    addTrack(track); // 트랙을 재생목록에 추가
    setLastClickedTrack(track); // 마지막으로 클릭한 트랙을 설정
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="text-center" style={{ marginBottom: "1.5rem" }}>
          🎤 아티스트 트랙 검색
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <input
            type="text"
            placeholder="아티스트 이름을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // 입력값 변경 시 상태 업데이트
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Enter 키를 눌렀을 때 검색
            className="input"
            style={{
              height: "40px",
              marginBottom: 0, // 🔥 override 필수!
              maxWidth: "300px",
            }}
          />
          <button
            onClick={handleSearch} // 검색 버튼 클릭 시 검색 실행
            className="button1"
            style={{
              height: "40px",
              padding: "0 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaSearch size={18} /> {/* 돋보기 아이콘 */}
          </button>
        </div>
        <ol style={{ padding: 0, listStyle: "none" }}>
          {tracks.map((track, index) => (
            <TrackItem
              key={track.mbid || `${track.name}-${index}`} // 각 트랙에 고유한 key 부여
              track={track}
              onAdd={handleAddToPlaylist} // 트랙 추가 함수 전달
            />
          ))}
        </ol>
        <div ref={loaderRef} style={{ height: "30px" }} />{" "}
        {/* IntersectionObserver용 로딩 영역 */}
      </div>
    </div>
  );
};

export default MusicArtist; // 컴포넌트 내보내기
