import React, { useState } from 'react';
import './styles.css'; // CSS 파일이 src 폴더에 위치한 경우

// 이미지 파일을 src 폴더에서 가져옵니다.
import Logo from './logo.png';
import NavbarBookmark from './navbar-bookmark.png';
import NavbarMypage from './navbar-mypage.png';
import AboutUs from './aboutus.png';
import Issue1 from './issue-1.png';
import Issue2 from './issue-2.png';
import Issue3 from './issue-3.png';
import Issue4 from './issue-4.png';
import Solve from './howtosolve.png';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [searchContent, setSearchContent] = useState('');
  const navigate = useNavigate();

  // 검색어 입력 핸들러
  const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchContent(event.target.value);
  };

  // Enter 키 입력 핸들러
  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      if (searchContent.trim().toLowerCase() === '비타민') {
        navigate('/searchlist2'); // 비타민 검색 시 이동할 경로
      } else if (searchContent.trim().toLowerCase() === '프로틴 드링크') {
        navigate('/searchlist'); // 프로틴 드링크 검색 시 이동할 경로
      }
    }
  };
  
  

  // 인증 페이지로 이동하는 핸들러
  const goAuth = () => {
    navigate('/auth/sign-in');
  };

  return (
    <div>
      <div className="main-header">
        <div className="navbar">
          <div className="logo">
            <img className="logo-image" src={Logo} alt="logo-image" />
          </div>
          <div className="navbar-content">
            <img className="navbar-image" src={NavbarBookmark} alt="navbar-bookmark" />
            <img className="navbar-image" onClick={goAuth} src={NavbarMypage} alt="navbar-mypage" />
          </div>
        </div>
        <div className="searcher">
          <h1 className="search-info">솔직한 정보가 궁금한 제품을 검색해보세요!</h1>
          <p className="search-info-eng">Search for products you're curious about for honest information!</p>
          <div className="search-container">
          <input
              type="text"
              className="search-box"
              placeholder="검색어를 입력해주세요. (예 : 프로틴 드링크)"
              value={searchContent}
              onChange={handleSearchChange} // 입력 변화 시 핸들러 호출
              onKeyDown={handleKeyDown} // Enter 키 입력 시 핸들러 호출
            />
          </div>
        </div>
      </div>
      <div className="aboutus">
        <h1>About us</h1>
        <img src={AboutUs} alt="About Us" />
      </div>
      <div className="issue">
        <div className="issue-top">
          <h1>최근 <span>허위 광고</span> 이슈</h1>
          <p className="issue-top-right">더 보기</p>
        </div>
        <div className="issue-content">
          <img className="mainissue" src={Issue1} alt="main issue" />
          <div className="issue-content-list">
            <img className="subissue" src={Issue2} alt="sub issue" />
            <img className="subissue" src={Issue3} alt="sub issue" />
            <img className="subissue" src={Issue4} alt="sub issue" />
          </div>
        </div>
      </div>
      <div className="howtosolve">
        <h1>함께 해요, <span>소비자보호원</span> 신고</h1>
        <img src={Solve} alt="How to Solve" />
      </div>
      <div className="site-information">
        <p className="site-information-text">이용약관 개인정보처리방침 ⓒ JellyFishView Corp.</p>
      </div>
    </div>
  );
}
