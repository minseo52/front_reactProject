import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePlaylist } from "../context/PlaylistContext";
import { FaSearch } from "react-icons/fa";
import "../styles/common.css";

const API_KEY = "";

const Album = () => {
  const [username, setUsername] = useState("");
  const [tracks, setTracks] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { addTrack, setLastClickedTrack } = usePlaylist();
  const loaderRef = useRef(null);
  const pageRef = useRef(1); // 페이지 ref로 관리

  const handleSearch = async () => {
    if (!username.trim()) return;
    setTracks([]);
    setHasMore(true);
    pageRef.current = 1;
    fetchTracks(username, 1);
  };

  const fetchTracks = async (user, pageNum) => {
    if (!user) return;
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${API_KEY}&format=json&limit=10&page=${pageNum}`
      );
      const data = await response.json();

      if (data?.toptracks?.track) {
        setTracks((prev) => [...prev, ...data.toptracks.track]);
        if (data.toptracks.track.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("트랙 불러오기 실패:", error);
      setHasMore(false);
    }
  };

  const handleAddTrack = (track) => {
    const formattedTrack = {
      name: track.name,
      artist: { name: track.artist.name },
      image: track.image,
    };
    addTrack(formattedTrack);
    setLastClickedTrack(formattedTrack);
    // alert(`${track.name}이(가) 재생목록에 추가되었습니다.`);
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && username) {
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchTracks(username, nextPage);
      }
    },
    [hasMore, username]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [handleObserver]);

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="text-center" style={{ marginBottom: "1.5rem" }}>
          🎧 사용자의 트랙 검색
        </h2>
        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Last.fm 사용자 이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="input"
            />
            <button onClick={handleSearch} className="button">
              <FaSearch size={18} />
            </button>
          </div>
        </div>
        <ul className="album-track-list">
          {tracks.map((track, index) => (
            <li key={index} className="album-track-item">
              <img
                src={track.image?.[2]?.["#text"] || "/default-album.jpg"}
                alt={track.name}
                className="album-track-image"
              />
              <div className="album-track-info">
                <div className="album-track-title">{track.name}</div>
                <div className="album-track-artist">{track.artist.name}</div>
              </div>
              <button className="button" onClick={() => handleAddTrack(track)}>
                재생
              </button>
            </li>
          ))}
        </ul>
        {hasMore && <div ref={loaderRef} style={{ height: "30px" }} />}
      </div>

      <style>{`
        .search-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .album-track-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .album-track-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 500px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .album-track-image {
          width: 50px;
          height: 50px;
          border-radius: 5px;
          margin-right: 10px;
        }

        .album-track-info {
          flex: 1;
        }

        .album-track-title {
          font-size: 16px;
          font-weight: bold;
        }

        .album-track-artist {
          font-size: 14px;
          color: #777;
        }

        .button {
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          background-color: #22b8cf;
          color: white;
          border: none;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        .button:hover {
          background-color: #18a0b3;
        }

        body.dark-mode .album-track-item {
          background-color: #555;
          border: 1px solid #777;
        }

        body.dark-mode .album-track-title {
          color: #fff;
        }

        body.dark-mode .album-track-artist {
          color: #bbb;
        }

        body.dark-mode .button {
          background-color: #777;
          border: 1px solid #888;
        }

        body.dark-mode .button:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  );
};

export default Album;
