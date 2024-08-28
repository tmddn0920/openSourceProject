import React, { useState, useEffect, useRef } from 'react';
import './searchlist2-styles.css'; // CSS 파일 import

// 로컬 이미지 import
import Logo from './logo.png';
import NavbarBookmark from './navbar-bookmark.png';
import NavbarMypage from './navbar-mypage.png';

// 상품 데이터 배열 (이미지 URL을 직접 사용)
const products = [
    {
        name: "얼라이브 원스데일리 포맨 멀티비타민 80정",
        price: 27900,
        rating: 4.84,
        reviews: 505,
        truthscore: 3.88,
        image: "https://image7.coupangcdn.com/image/retail/images/38797201168226-701556db-e129-4283-bc19-bca7a345ab64.jpg",
        link: "http://localhost:3000/product7"
    },
    {
        name: "익스트림 멀티비타민 미네랄 700mg x 60캡슐",
        price: 74000,
        rating: 4.85,
        reviews: 450,
        truthscore: 3.01,
        image: "https://image9.coupangcdn.com/image/vendor_inventory/61d1/f7a588481eecd2473ec981c56c713c7c2bed8db8255ee78bbee829c862b4.jpg",
        link: "http://localhost:3000/product8"
    },
    {
        name: "고려은단 멀티비타민 올인원 60캡슐, 3개",
        price: 64900,
        rating: 4.88,
        reviews: 2000,
        truthscore: 3.69,
        image: "https://shop-phinf.pstatic.net/20230706_241/16886246253830PaSi_JPEG/13252469203366447_1419774283.jpg?type=m510",
        link: "http://localhost:3000/product9"
    },
    {
        name: "종근당 이뮨 듀오 멀티 비타맥스 2박스",
        price: 39500,
        rating: 4.87,
        reviews: 780,
        truthscore: 3.81,
        image: "https://shop-phinf.pstatic.net/20230105_138/1672895111102emOAo_JPEG/197794979926097_1035474786.jpg?type=m510",
        link: "http://localhost:3000/product10"
    },
    {
        name: "종근당건강 아임비타 멀티비타민 이뮨샷 30병",
        price: 79000,
        rating: 4.92,
        reviews: 520,
        truthscore: 4.18,
        image: "https://shop-phinf.pstatic.net/20240812_20/1723418139612dbOq3_JPEG/25351412442268394_1851377336.jpg?type=m510",
        link: "http://localhost:3000/product11"
    },
    {
        name: "덴프스 트루바이타민I 3개월분",
        price: 94200,
        rating: 4.89,
        reviews: 4200,
        truthscore: 3.92,
        image: "https://shop-phinf.pstatic.net/20240820_159/1724113399632nxhgN_JPEG/8275413440897783_1177918732.jpg?type=m510",
        link: "http://localhost:3000/product12"
    }    
];

const itemsPerPage = 20;

const SearchList2: React.FC = () => {
    const [currentSortOption, setCurrentSortOption] = useState('신뢰도순');
    const [sortedProducts, setSortedProducts] = useState(products);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(products.length);
    const dropdownMenuRef = useRef<HTMLUListElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        sortProducts(currentSortOption);
    }, [currentSortOption]);

    useEffect(() => {
        renderPagination(totalItems);
    }, [currentPage, totalItems]);

    const sortProducts = (option: string) => {
        let sorted = [...products];
        switch (option) {
            case '신뢰도순':
                sorted.sort((a, b) => b.truthscore - a.truthscore);
                break;
            case '평점순':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case '낮은 가격순':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case '높은 가격순':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case '리뷰순':
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
        }
        setSortedProducts(sorted);
    };

    const handleDropdownToggle = () => {
        if (dropdownMenuRef.current) {
            dropdownMenuRef.current.classList.toggle('visible');
        }
    };

    const handleSortOptionClick = (option: string) => {
        setCurrentSortOption(option);
        if (dropdownMenuRef.current) {
            dropdownMenuRef.current.classList.remove('visible');
        }
    };

    const renderPagination = (totalItems: number) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={i === currentPage ? 'current-page' : ''}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ◀
                </button>
                {pages}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    ▶
                </button>
            </>
        );
    };

    const productsToDisplay = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className="navbar">
                <div className="logo">
                    <img className="logo-image" src={Logo} alt="logo-image" />
                </div>
                <div className="navbar-content">
                    <img className="navbar-image" src={NavbarBookmark} alt="navbar-bookmark" />
                    <img className="navbar-image" src={NavbarMypage} alt="navbar-mypage" />
                </div>
            </div>
            <div className="container">
                <div className="header">
                    <h1><span>'비타민' </span>에 대한 검색 결과</h1>
                    <div className="sub-header">
                        <span className="total-items">총 <span>{sortedProducts.length}</span>개의 상품</span>
                        <div className="filter">
                            <div className="dropdown">
                                <button ref={filterButtonRef} onClick={handleDropdownToggle}>
                                    <span id="buttonText">{currentSortOption}</span>
                                    <span id="arrow">▼</span>
                                </button>
                                <ul id="dropdownMenu" ref={dropdownMenuRef} className="dropdown-menu">
                                    {['신뢰도순', '평점순', '낮은 가격순', '높은 가격순', '리뷰순'].map(option => (
                                        <li key={option} onClick={() => handleSortOptionClick(option)}>
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-list" id="productList">
                    {productsToDisplay.map(product => (
                        <div 
                            key={product.name} 
                            className="product-item"
                            onClick={() => window.location.href = product.link} // Add onClick to navigate to the product link
                        >
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h3>{product.name}</h3>
                            <div className="product-info">
                                <div className="price">{product.price.toLocaleString()}원</div>
                                <div className="rating">★{product.rating}<span>({product.reviews})</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="pagination" id="pagination">
                {renderPagination(totalItems)}
            </div>
            <div className="site-information">
                <p className="site-information-text">이용약관 개인정보처리방침 ⓒ JellyFishView Corp.</p>
            </div>
        </div>
    );
}

export default SearchList2;
