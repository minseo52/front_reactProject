import React from "react";
import { usePlaylist } from "../context/PlaylistContext"; // PlaylistContext에서 필요한 값들 가져오기
import "../styles/PlayList.css"; // PlayList 스타일 파일 불러오기

const PlayList = () => {
  const { playlist, removeTrack, lastClickedTrack } = usePlaylist();
  // playlist: 현재 재생목록,
  // removeTrack: 특정 트랙 삭제 함수,
  // lastClickedTrack: 마지막으로 클릭한 트랙

  // 현재 다크모드인지 확인 (body에 dark-mode 클래스가 있는지 검사)
  const isDarkMode = document.body.classList.contains("dark-mode");

  return (
    <div
      className={`playlist-container ${isDarkMode ? "dark" : ""}`} // 다크모드일 경우 'dark' 클래스 추가
    >
      <h3>📻 재생목록</h3>

      {/* 마지막으로 클릭한 트랙 정보 표시 */}
      {lastClickedTrack ? (
        <div className="recent-track">
          <strong>최근 클릭한 트랙:</strong>
          <span>
            {lastClickedTrack.name} - {lastClickedTrack.artist}
          </span>
        </div>
      ) : (
        // 클릭한 트랙이 없다면 안내 메시지
        <div className="recent-track">
          <span>최근 클릭한 트랙이 없습니다.</span>
        </div>
      )}

      {/* 재생목록의 트랙들을 하나씩 렌더링 */}
      {playlist.map((track, index) => (
        <div key={`${track.name}-${index}`} className="playlist-item">
          <span>
            {track.name} - {track.artist}
          </span>
          {/* 해당 트랙 삭제 버튼 */}
          <button onClick={() => removeTrack(index)} className="delete-button">
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlayList;
