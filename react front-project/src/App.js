// App.js
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// 페이지 컴포넌트 임포트
import Categories from "./music/Categories"; // 카테고리 탭을 렌더링하는 컴포넌트
import MusicArtist from "./music/MusicArtist"; // 아티스트 관련 페이지 컴포넌트
import MusicChat from "./music/MusicChat"; // 인기차트 페이지 컴포넌트
import Album from "./music/Album"; // 앨범 검색 페이지 컴포넌트
import PlayListPreview from "./music/PlayListPreview"; // 재생목록 미리보기 컴포넌트
import PlayListPage from "./music/PlayListPage"; // 재생목록 상세 페이지 컴포넌트

// 전역 상태 관리 컨텍스트 임포트
import { PlaylistProvider } from "./context/PlaylistContext"; // 재생목록 상태 관리
import { TrackProvider } from "./context/TrackContext"; // 트랙 상태 관리

// 스타일 파일 임포트
import "./App.css"; // 기본 스타일
import "./styles/common.css"; // 공통 스타일
import "./styles/dark-mode.css"; // 다크 모드 스타일

// 앱 메인 컨텐츠 컴포넌트
function AppContent({ darkMode, toggleDarkMode }) {
  const [showTopButton, setShowTopButton] = useState(false); // Top 버튼 표시 여부 상태

  // 스크롤 이벤트로 Top 버튼 표시 제어 (스크롤 300px 이상 내리면 Top 버튼이 나타남)
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300); // 300px 이상 스크롤 시 Top 버튼 표시
    };
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가
    return () => window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, []); // 빈 배열을 두 번째 인자로 줘서 컴포넌트 최초 마운트 시에만 실행되도록 함

  // 다크 모드 클래스를 `body`에 추가/제거하여 스타일 변경
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode); // 다크 모드 여부에 따라 'dark' 클래스 토글
  }, [darkMode]); // 다크 모드 상태가 바뀔 때마다 실행

  // 최상단으로 스크롤 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // 부드럽게 스크롤을 최상단으로 이동
  };

  return (
    <div className="App">
      <h1 className="logo">Kigs</h1> {/* 앱의 로고 */}
      {/* 다크 모드 토글 버튼 */}
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}{" "}
        {/* 다크 모드 상태에 따라 버튼 텍스트 변경 */}
      </button>
      {/* 카테고리 네비게이션 */}
      <Categories />
      {/* 페이지 라우팅 설정 */}
      <Routes>
        <Route path="/" element={<Navigate to="/popularity" replace />} />{" "}
        {/* 기본 경로는 인기차트로 리디렉션 */}
        <Route path="/popularity" element={<MusicChat />} />{" "}
        {/* 인기차트 페이지 */}
        <Route path="/Artist" element={<MusicArtist />} />{" "}
        {/* 아티스트 검색 페이지 */}
        <Route path="/Album" element={<Album />} /> {/* 앨범 검색 페이지 */}
        <Route path="/PlayList" element={<PlayListPage />} />{" "}
        {/* 재생목록 상세 페이지 */}
      </Routes>
      {/* 하단 재생목록 미리보기 컴포넌트 */}
      <PlayListPreview />
      {/* Top 버튼: 스크롤 300px 이상 시에만 표시 */}
      {showTopButton && (
        <button
          onClick={scrollToTop} // 버튼 클릭 시 scrollToTop 함수 호출
          style={{
            position: "fixed", // 화면 고정
            bottom: "80px", // 화면 하단 80px 위에 배치
            right: "20px", // 화면 오른쪽 20px 간격
            padding: "0.6rem 1rem", // 버튼 내부 여백
            backgroundColor: "#4dabf7", // 버튼 배경색
            color: "#fff", // 버튼 텍스트 색
            border: "none", // 테두리 없음
            borderRadius: "8px", // 둥근 모서리
            cursor: "pointer", // 커서 모양을 손 모양으로 변경
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)", // 버튼 그림자 효과
            zIndex: 999, // 버튼이 다른 요소들 위에 있도록 zIndex 설정
          }}
        >
          ⬆ Top {/* 버튼 텍스트 */}
        </button>
      )}
    </div>
  );
}

// 앱 루트 컴포넌트
function App() {
  // 다크 모드 상태: localStorage에서 초기값 불러옴
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode"); // localStorage에서 다크 모드 여부 불러오기
    return stored === "true"; // "true"일 경우 true 반환
  });

  // 다크 모드 토글 함수: 상태와 localStorage 모두 업데이트
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode; // 기존 상태를 반전시킴
      localStorage.setItem("darkMode", newMode); // 새 상태를 localStorage에 저장
      return newMode; // 새 상태 반환
    });
  };

  // 다크 모드 클래스 초기 적용 (페이지 새로고침 시에도 상태 반영)
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode); // 다크 모드 상태에 맞게 body 클래스 토글
  }, [darkMode]); // 다크 모드 상태가 변경될 때마다 실행

  return (
    // TrackContext와 PlaylistContext로 앱 전체를 감쌈
    <TrackProvider>
      <PlaylistProvider darkMode={darkMode}>
        {/* AppContent 컴포넌트에 다크 모드 상태와 토글 함수 전달 */}
        <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </PlaylistProvider>
    </TrackProvider>
  );
}

export default App;
