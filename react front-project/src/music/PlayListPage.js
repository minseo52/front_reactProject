import React, { useRef, useState } from "react";
import { usePlaylist } from "../context/PlaylistContext"; // 재생목록 컨텍스트에서 값 가져오기

const PlayListPage = () => {
  const { playlist, removeTrack } = usePlaylist(); // 재생목록과 삭제 함수 사용
  const audioRef = useRef(null); // 오디오 요소에 접근하기 위한 ref
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null); // 현재 재생 중인 URL 상태

  const isDarkMode = document.body.classList.contains("dark"); // 다크모드 여부 확인

  // 트랙 재생 핸들러
  const handlePlay = (track) => {
    const previewUrl = track?.url; // 트랙의 미리듣기 URL
    if (previewUrl) {
      setCurrentTrackUrl(previewUrl); // 현재 재생 중인 URL로 설정
      if (audioRef.current) {
        audioRef.current.pause(); // 현재 재생 중이면 멈추고
        audioRef.current.load(); // 새 트랙 로드
        audioRef.current.play().catch((e) => {
          // 자동 재생이 차단된 경우 예외 처리
          console.warn("재생이 차단됨:", e);
        });
      }
    } else {
      alert("재생 가능한 미리듣기 URL이 없습니다."); // URL이 없으면 경고
    }
  };

  // 트랙 삭제 핸들러
  const handleRemove = (index) => {
    removeTrack(index); // 해당 인덱스의 트랙 제거
  };

  return (
    <div
      style={{
        padding: "2rem", // 여백
        maxWidth: "800px", // 최대 너비
        margin: "0 auto", // 중앙 정렬
        background: isDarkMode ? "#1e1e1e" : "#fff", // 배경색 (다크모드 여부에 따라)
        color: isDarkMode ? "#fff" : "#000", // 글자색
        borderRadius: "12px", // 둥근 테두리
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // 그림자
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>playlist</h2>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {/* playlist의 각 트랙 렌더링 */}
        {playlist.map((track, index) => (
          <li
            key={index}
            style={{
              display: "flex", // 가로 정렬
              alignItems: "center",
              justifyContent: "space-between", // 양 끝 정렬
              backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa", // 배경색
              padding: "1rem", // 내부 여백
              marginBottom: "0.8rem", // 요소 간 간격
              borderRadius: "8px", // 둥근 테두리
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // 그림자
              color: isDarkMode ? "#fff" : "#000", // 텍스트 색상
            }}
          >
            <div style={{ flex: 1 }}>
              {/* 트랙 이름과 아티스트 표시 */}
              <strong>{track.name || "이름 없음"}</strong> -{" "}
              {track.artist?.name || "아티스트 정보 없음"}
            </div>

            <div>
              {/* 재생 버튼 */}
              <button
                onClick={() => handlePlay(track)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4caf50", // 녹색
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                재생
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={() => handleRemove(index)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f44336", // 빨간색
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 실제 재생되는 오디오 요소 (화면에는 안 보이도록 hidden 처리) */}
      <audio ref={audioRef} style={{ display: "none" }}>
        <source src={currentTrackUrl} type="audio/mpeg" />
        브라우저에서 오디오를 지원하지 않습니다.
      </audio>
    </div>
  );
};

export default PlayListPage;
