import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/categories.css"; // CSS 파일 import

const categories = [
  { name: "popularity", text: "인기순위" },
  { name: "Artist", text: "아티스트" },
  { name: "Album", text: "사용자 검색" },
  { name: "PlayList", text: "재생목록" },
];

const Categories = () => {
  return (
    <div className="categories-block">
      {categories.map((c) => (
        <NavLink
          key={c.name}
          to={`/${c.name}`}
          className={({ isActive }) =>
            isActive ? "category active" : "category"
          }
        >
          {c.text}
        </NavLink>
      ))}
    </div>
  );
};

export default Categories;
