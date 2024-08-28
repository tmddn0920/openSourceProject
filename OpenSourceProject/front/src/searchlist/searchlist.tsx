import React, { useState, useEffect, useRef } from 'react';
import './searchlist-styles.css';

// 이미지 파일들을 src 폴더에서 가져옵니다.
import Logo from './logo.png';
import NavbarBookmark from './navbar-bookmark.png';
import NavbarMypage from './navbar-mypage.png';

const products = [
    { name: "빙그레 더단백 드링크 초코 250ml x 36개", price: 50380, rating: 4.83, reviews: 505, truthscore: 4.37, image: "https://sitem.ssgcdn.com/26/11/18/item/2097001181126_i1_1200.jpg", link: "http://localhost:3000/product2" },
    { name: "블루다이아몬드 아몬드 브리즈 뉴트리플러스 프로틴 190ml 48개", price: 27800, rating: 4.83, reviews: 505, truthscore: 4.08, image: "https://image6.coupangcdn.com/image/retail/images/3565495096119914-4be83c18-d9f3-483d-879a-19eeccc0c8c3.jpg", link: "http://localhost:3000/product3" },
    { name: "하이뮨 일동후디스 프로틴 밸런스 액티브 밀크 오리지널 250ml 18개", price: 28570, rating: 4.77, reviews: 505, truthscore: 3.61, image: "https://image10.coupangcdn.com/image/retail/images/451104746482649-0e272c9e-dedb-430a-965f-8087c5f42704.jpg", link: "http://localhost:3000/product4" },
    { name: "WPI 셀렉스 프로핏 웨이프로틴 초콜릿 24입", price: 44900, rating: 4.86, reviews: 2505, truthscore: 3.54, image: "https://shop-phinf.pstatic.net/20230407_53/1680843536392o9eUJ_JPEG/81979425100354504_93485958.jpg?type=m510", link: "http://localhost:3000/product5" },
    { name: "랩노쉬 프로틴 드링크 카카오 350ml 12개", price: 23900, rating: 4.84, reviews: 225, truthscore: 4.16, image: "https://image6.coupangcdn.com/image/vendor_inventory/421f/bd89a433d55e1ab953d99701c5561a600f110da3c68a486e299b09fb9422.jpg", link: "http://localhost:3000/product" },
    { name: "대상웰라이프 마이밀 마시는 뉴프로틴 오리지널 190ml 30팩", price: 34900, rating: 4.86, reviews: 1725, truthscore: 2.85, image: "https://shop-phinf.pstatic.net/20240726_209/1721953634095hSEbN_PNG/1538571336896516_613058034.png?type=m510", link: "http://localhost:3000/product6" }
    // ... 더 많은 상품
];

const itemsPerPage = 20;

const SearchList: React.FC = () => {
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
                    <h1><span>'프로틴 드링크' </span>에 대한 검색 결과</h1>
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

export default SearchList;

