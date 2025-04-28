import { createContext, useContext, useState, useEffect } from "react";

// TrackContext 생성: 트랙 관련 상태를 전역으로 관리하기 위한 context 생성
export const TrackContext = createContext();

// TrackProvider 컴포넌트: 자식 컴포넌트에 트랙 상태를 제공
export const TrackProvider = ({ children }) => {
  const [allTracks, setAllTracks] = useState([]); // 전체 트랙 데이터를 저장할 상태
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크모드 상태 관리

  // 다크모드 전환 함수: 현재 모드를 반전시킴
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // 다크모드 상태가 변경될 때마다 body에 클래스 추가/제거
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode"); // 다크모드 클래스 추가
    } else {
      document.body.classList.remove("dark-mode"); // 다크모드 클래스 제거
    }
  }, [isDarkMode]); // isDarkMode가 바뀔 때마다 실행됨

  return (
    // TrackContext.Provider를 통해 하위 컴포넌트에 값 제공
    <TrackContext.Provider
      value={{
        allTracks, // 전체 트랙 데이터
        setAllTracks, // 전체 트랙 설정 함수
        isDarkMode, // 다크모드 여부
        toggleDarkMode, // 다크모드 토글 함수
      }}
    >
      {children} {/* 자식 컴포넌트들 렌더링 */}
    </TrackContext.Provider>
  );
};

// useTrack 훅: context를 쉽게 사용하기 위한 커스텀 훅
export const useTrack = () => {
  return useContext(TrackContext);
};
