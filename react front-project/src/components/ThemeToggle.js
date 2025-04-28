import React, { useEffect } from "react";

const ThemeToggle = () => {
  // 페이지 로드시 저장된 테마 적용
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  // 테마 토글 함수
  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const newTheme = document.body.classList.contains("dark")
      ? "dark"
      : "light";
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="button"
      style={{ marginBottom: "1rem" }}
    >
      🌗 테마 변경
    </button>
  );
};

export default ThemeToggle;
