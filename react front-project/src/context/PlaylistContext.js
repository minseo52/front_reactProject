import React, { createContext, useContext, useState, useEffect } from "react";

// 전역으로 사용할 PlaylistContext 생성
const PlaylistContext = createContext();

// PlaylistProvider: 하위 컴포넌트에 playlist 관련 전역 상태를 제공하는 Provider 컴포넌트
export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]); // 재생목록 상태
  const [lastClickedTrack, setLastClickedTrack] = useState(null); // 마지막으로 클릭한 트랙 상태
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크모드 상태

  // 컴포넌트 마운트 시 localStorage에서 저장된 테마를 불러와 적용
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme"); // 저장된 테마 가져오기
    if (savedTheme === "dark") {
      setIsDarkMode(true); // 다크모드 설정
      document.body.classList.add("dark"); // body에 다크모드 클래스 추가
    } else {
      document.body.classList.remove("dark"); // 라이트모드인 경우 다크 클래스 제거
    }
  }, []);

  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode); // 현재 상태 반전
    const newTheme = !isDarkMode ? "dark" : "light"; // 새 테마 결정
    localStorage.setItem("theme", newTheme); // 테마를 localStorage에 저장
    document.body.classList.toggle("dark"); // body에 dark 클래스 토글
  };

  // 트랙을 재생목록에 추가하는 함수
  const addTrack = (track) => {
    setPlaylist((prev) => [...prev, track]); // 기존 목록에 트랙 추가
    setLastClickedTrack(track); // 마지막으로 클릭한 트랙 업데이트
  };

  // 인덱스를 기반으로 특정 트랙을 제거하는 함수
  const removeTrack = (index) => {
    setPlaylist((prev) => {
      const newPlaylist = prev.filter((_, i) => i !== index); // 해당 인덱스 제외한 목록으로 재설정

      // 재생목록이 비었으면 마지막 클릭한 트랙도 초기화
      if (newPlaylist.length === 0) {
        setLastClickedTrack(null); // 재생목록이 비었으면 lastClickedTrack을 null로 설정
      }

      return newPlaylist;
    });
  };

  // 재생목록 전체를 초기화하는 함수
  const clearPlaylist = () => {
    setPlaylist([]); // 재생목록 비우기
    setLastClickedTrack(null); // 마지막 클릭한 트랙 초기화
  };

  // context로 제공할 값들을 객체로 정의
  const value = {
    playlist, // 재생목록 상태
    addTrack, // 트랙 추가 함수
    removeTrack, // 트랙 제거 함수
    clearPlaylist, // 재생목록 초기화 함수
    lastClickedTrack, // 마지막 클릭된 트랙
    setLastClickedTrack, // 마지막 클릭된 트랙 설정 함수
    isDarkMode, // 다크모드 여부
    toggleDarkMode, // 다크모드 토글 함수
  };

  // PlaylistContext.Provider로 children을 감싸서 context 값을 하위 컴포넌트에 전달
  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

// context를 사용하는 커스텀 hook 정의
export const usePlaylist = () => useContext(PlaylistContext);
