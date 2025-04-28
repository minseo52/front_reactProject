import React from "react";
import { usePlaylist } from "../context/PlaylistContext"; // PlaylistContext에서 상태 및 함수 사용
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 hook
import "../styles/PlayListPreview.css"; // 스타일 파일 import

// 최근 클릭한 트랙과 재생목록을 간단히 보여주는 하단 미리보기 컴포넌트
const PlayListPreview = () => {
  const { playlist, lastClickedTrack } = usePlaylist(); // context에서 재생목록과 마지막 클릭 트랙 가져오기
  const navigate = useNavigate(); // 페이지 이동 함수

  return (
    <div className="playlist-preview">
      {" "}
      <strong className="playlist-preview__title">🎵 최근 클릭한 트랙:</strong>
      {lastClickedTrack ? (
        <span>
          {lastClickedTrack.name} -{" "}
          {typeof lastClickedTrack.artist === "string"
            ? lastClickedTrack.artist
            : lastClickedTrack.artist?.name}
        </span>
      ) : (
        <span>없음</span>
      )}
      {playlist.length > 0 && (
        <button
          onClick={() => navigate("/PlayList")}
          className="playlist-preview__button"
        >
          전체 보기
        </button>
      )}
    </div>
  );
};

export default PlayListPreview; // 컴포넌트 외부에서 사용할 수 있도록 export
