import React, { useEffect, useState, useRef } from 'react';
import styles from './Product.module.css';  // 모듈 CSS를 import
import Logo from './logo.png';
import NavbarBookmark from './navbar-bookmark.png';
import NavbarMypage from './navbar-mypage.png';
import Star from './Star.png';
import ReviewIcon from './review-icon.png';
import StarColor from './star-color.png';
import Question from './question.png';
import Reviewbookmark from './reviewbookmark.png';
import reviewsData from './product5review.json';

const ProductPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviews] = useState(initialReviews);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 9;
    const [currentFilters, setCurrentFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>('truthscore');

    // Ref를 사용해 DOM 요소를 참조합니다.
    const productImageRef = useRef<HTMLImageElement | null>(null);
    const subImagesRef = useRef<NodeListOf<HTMLImageElement> | null>(null);
    const nextButtonRef = useRef<HTMLButtonElement | null>(null);
    const prevButtonRef = useRef<HTMLButtonElement | null>(null);

    const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

    const toggleReviewExpansion = (reviewId: number) => {
        setExpandedReviews(prevState =>
            prevState.includes(reviewId)
                ? prevState.filter(id => id !== reviewId)
                : [...prevState, reviewId]
        );
    };

    useEffect(() => {
        const productImage = productImageRef.current;
        const subImages = subImagesRef.current;
        const nextButton = nextButtonRef.current;
        const prevButton = prevButtonRef.current;

        const updateMainImage = (index: number) => {
            if (productImage && subImages && index >= 0 && index < subImages.length) {
                productImage.src = subImages[index].src;
                setCurrentIndex(index);
            }
        };

        if (subImages) {
            subImages.forEach((img, index) => {
                img.addEventListener('click', () => {
                    updateMainImage(index);
                });
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % (subImages?.length || 1);
                updateMainImage(nextIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + (subImages?.length || 1)) % (subImages?.length || 1);
                updateMainImage(prevIndex);
            });
        }
    }, [currentIndex]);
    
    const filterReviews = (keyword: string) => {
        setCurrentFilters(prevFilters =>
            prevFilters.includes(keyword)
                ? prevFilters.filter(f => f !== keyword)
                : [...prevFilters, keyword]
        );
        setCurrentPage(1); // 필터가 변경될 때 페이지를 첫 페이지로 리셋
    };

    const sortReviews = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const sortReviewsArray = (reviewsArray: Review[]) => {
        switch (sortOption) {
            case 'rating_desc':
                return reviewsArray.sort((a, b) => b.rating - a.rating);
            case 'rating_asc':
                return reviewsArray.sort((a, b) => a.rating - b.rating);
            case 'latest':
                return reviewsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            case 'oldest':
                return reviewsArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            case 'truthscore' :
                return reviewsArray.sort((a, b) => a.id - b.id);
            default:
                return reviewsArray;
        }
    };

    const displayReviews = () => {
        const filteredReviews = sortReviewsArray(
            reviews.filter(review =>
                currentFilters.every(filter => review.keywords.includes(filter))
            )
        );
    
        const start = (currentPage - 1) * reviewsPerPage;
        const end = start + reviewsPerPage;
        const paginatedReviews = filteredReviews.slice(start, end);
    
        return paginatedReviews.map(review => {
            const ReviewImage = require(`${review.image_url}`);
    
            return (
                <div key={review.id} className={styles.reviewCard}>
                    <img className={styles.reviewimage} src={ReviewImage} alt="리뷰 이미지" />
                    <div className={styles.reviewRatingContainer}>
                        <p className={styles.reviewEvaluation}>한줄 평가</p>
                        <div className={styles.reviewRating}>★ {review.rating}</div>
                    </div>
                    <div className={styles.reviewInfoContainer}>
                        <div
                            className={`${styles.reviewText} ${
                                expandedReviews.includes(review.id) ? styles.expanded : ''
                            }`}
                        >
                            {review.text}
                        </div>
                        <span
                            className={styles.readMore}
                            onClick={() => toggleReviewExpansion(review.id)}
                        >
                            {expandedReviews.includes(review.id) ? '간략히' : '더 보기'}
                        </span>
                        <div className={styles.sourceSection}>
                            <div className={styles.reviewSource}>{review.source}</div>
                            <img className={styles.reviewbookmark} src={Reviewbookmark} alt="bookmark" />
                        </div>
                    </div>
                </div>
            );
        });
    };    

    const updatePagination = (totalReviews: number) => {
        const totalPages = Math.ceil(totalReviews / reviewsPerPage);
        const startPage = Math.max(currentPage - 2, 1);
        const endPage = Math.min(startPage + 4, totalPages);
        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`${styles.pageNumber} ${i === currentPage ? styles.active : ''}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <>
                <button
                    className={styles.reviewArrowButton}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    &#9664;
                </button>
                {pageNumbers}
                <button
                    className={styles.reviewArrowButton}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    &#9654;
                </button>
            </>
        );
    };

    const filteredReviewsCount = sortReviewsArray(
        reviews.filter(review =>
            currentFilters.every(filter => review.keywords.includes(filter))
        )
    ).length;

    return (
        <div className={styles.Body}>
            <div className={styles.navbar}>
                <div className={styles.logo}>
                    <img className={styles.logoImage} src={Logo} alt="logo-image" />
                </div>
                <div className={styles.navbarContent}>
                    <img className={styles.navbarImage} src={NavbarBookmark} alt="bookmark-image" />
                    <img className={styles.navbarImage} src={NavbarMypage} alt="mypage-image" />
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.productInfo}>
                        <h1 className={styles.productName}>WPI 셀렉스 프로핏 웨이프로틴 초콜릿 24입</h1>
                        <h2 className={styles.productCompany}>셀렉스</h2>
                        <div className={styles.productImageSection}>
                            <img id="product-image" className={styles.productImage} src="https://shop-phinf.pstatic.net/20230407_53/1680843536392o9eUJ_JPEG/81979425100354504_93485958.jpg?type=m510" alt="제품 이미지" ref={productImageRef} />
                            <button className={`${styles.arrowButton} ${styles.arrowButtonPrev}`} ref={prevButtonRef}>&#10094;</button>
                            <button className={`${styles.arrowButton} ${styles.arrowButtonNext}`} ref={nextButtonRef}>&#10095;</button>
                            <div className={styles.subImages} ref={el => subImagesRef.current = el?.querySelectorAll('img') || null}>
                                <img src="https://shop-phinf.pstatic.net/20230407_53/1680843536392o9eUJ_JPEG/81979425100354504_93485958.jpg?type=m510" alt="서브 이미지 1" />
                                <img src="https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/7889152436390495-4554aac2-71b7-4894-8798-609fb0cfa0c4.jpg" alt="서브 이미지 2" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.reviewNewsSection}>
                    <div className={styles.reviewSection}>
                        <div className={styles.rating}>
                            <h3 className={styles.ratingTitle}>별점</h3>
                            <div className={styles.ratingContainer}>
                                <div className={styles.ratingScore}>
                                    <img className={styles.star} src={Star} alt="별" />
                                    <p><span>4.86</span></p>
                                </div>
                            </div>
                        </div>
                        <div id="reviews">
                            <p className={styles.review}>"단 맛이 적당해서 부담이 없다"</p>
                            <p className={styles.review}>"영양 균형을 맞추기 용이하다"</p>
                            <p className={styles.review}>"가성비가 좋다"</p>
                        </div>
                        <div className={styles.safetySection}>
                            <div className={styles.safetySectionName}>
                                <p className={styles.safetyRating}>해피리뷰 자체 등급</p>
                                <div className={styles.tooltipContainer}>
                                    <img className={styles.question} src={Question} alt="질문 마크" />
                                    <div className={styles.tooltipText}>
                                    해파리뷰에서는 제품에 인공 지능을 이용한 분석을 통해 자체 등급을 부여해요!
                                </div>
                            </div>
                        </div>
                            <p className={styles.safetyRatingResult}>우수</p>
                            <p className={styles.safetyRatingExplanation}>해피리뷰 프로그램이 판별한 결과 해당 제품은 투명해요!</p>
                        </div>
                    </div>
                    <div className={styles.relatedNews}>
                        <h2>관련 뉴스</h2>
                        <ul id="news-list" className={styles.newsList}>
                            <li>
                                <a href="https://www.donga.com/news/Culture/article/all/20200907/102825565/1" id="news1" className={styles.newsItem}>
                                    <img src = "https://dimg.donga.com/wps/NEWS/IMAGE/2020/09/07/102825554.1.jpg" alt="뉴스 이미지 1" className={styles.newsImage} />
                                    <div className={styles.newsContent}>
                                        <span className={styles.newsTitle}>매일유업, 간편하게 마시는 단백질 ‘셀렉스 스포츠 웨이프로틴 드링크’ 출시"</span>
                                        <p className={styles.newsDescription}>달걀 3개 분량 단백질 함유</p>
                                        <span className={styles.newsSource}>동아경제</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.productInfoSection}>
                    <h2 className={styles.productInfoSectionTitle}>상품 정보</h2>
                    <div className={styles.productInfoTable}>
                        <div className={styles.productInfoGrid}>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>상품번호</div>
                                <div className={styles.productInfoCellContent} id="product-number">19810227007491</div>
                                <div className={styles.productInfoCellHeader}>상품상태</div>
                                <div className={styles.productInfoCellContent} id="product-status">신상품</div>
                            </div>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>제조사</div>
                                <div className={styles.productInfoCellContent} id="manufacturer">(주)매일헬스뉴트리션</div>
                                <div className={styles.productInfoCellHeader}>브랜드</div>
                                <div className={styles.productInfoCellContent} id="brand">(주)매일유업</div>
                            </div>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>모델명</div>
                                <div className={styles.productInfoCellContent} id="model-name">셀렉스 프로핏 초콜릿</div>
                                <div className={styles.productInfoCellHeader}>원산지</div>
                                <div className={styles.productInfoCellContent} id="origin">상세설명에 표시</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.productInfoTable}>
                        <div className={styles.productInfoGrid}>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>주요기능성</div>
                                <div className={styles.productInfoCellContent} id="main-function">-</div>
                                <div className={styles.productInfoCellHeader}>영양소 원료명</div>
                                <div className={styles.productInfoCellContent} id="nutrient-name">해당없음</div>
                            </div>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>단백질 함량</div>
                                <div className={styles.productInfoCellContent} id="solid-content">20g</div>
                                <div className={styles.productInfoCellHeader}>당류 함량</div>
                                <div className={styles.productInfoCellContent} id="ginseng-content">0g</div>
                            </div>
                            <div className={styles.productInfoRow}>
                                <div className={`${styles.productInfoCellHeader}`}>-</div>
                                <div className={`${styles.productInfoCellContent} ${styles.fullWidth}`} id="ginsenoside">-</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.productInfoTable}>
                        <div className={styles.productInfoGrid}>
                            <div className={styles.productInfoRow}>
                                <div className={`${styles.productInfoCellHeader}`}>인증정보</div>
                                <div className={`${styles.productInfoCellContent} ${styles.fullWidth}`} id="certification">
                                    HACCP 인증
                                </div>
                            </div>
                        </div>
                    </div>
                    <p id="disclaimer" className={styles.disclaimer}>구매 전 인증 정보를 꼭 확인하세요.</p>
                </div>
            </div>
            <div className={styles.reviewContainer}>
                <div className={styles.reviewContainerNameBox}>
                    <h1 className={styles.reviewContainerName}>상품리뷰</h1>
                    <div className={styles.tooltipContainer}>
                        <img className={styles.question} src={Question} alt="질문 마크" />
                        <div className={styles.tooltipText2}>
                            해파리뷰는 인공 지능을 통해 신뢰도가 높은 리뷰를 우선 순으로 보여줘요!
                        </div>
                    </div>
                </div>
                <div className={styles.reviewSummaryBox}>
                    <div className={styles.reviewInfo}>
                        <div className={styles.rating}>
                            <h1 className={styles.ratingInfo}>사용자 총 별점</h1>
                            <div className={styles.stars}>
                                <img className={styles.star} src={StarColor} alt="star" />
                                <img className={styles.star} src={StarColor} alt="star" />
                                <img className={styles.star} src={StarColor} alt="star" />
                                <img className={styles.star} src={StarColor} alt="star" />
                                <img className={styles.star} src={StarColor} alt="star" />
                            </div>
                            <h2 className={styles.ratingAverage}>4.86 <span className={styles.averageRating}>/ 5</span></h2>
                        </div>
                        <div className={styles.reviewCount}>
                            <span id="review-count-info" className={styles.reviewCountInfo}>전체 리뷰 수</span>
                            <img id="review-icon" className={styles.reviewIcon} src={ReviewIcon} alt="review icon" />
                            <span id="review-count" className={styles.reviewCountNumber}>2505</span>
                        </div>
                        <div className={styles.keywordsSummary}>
                            <span id="keywords-summary" className={styles.keywordsSummaryTitle}>리뷰 메인 키워드</span>
                            <span className={styles.keywords}>#목넘김&nbsp;&nbsp;&nbsp;&nbsp;#휴대성</span>
                            <span className={styles.keywords}>#간편 섭취&nbsp;&nbsp;&nbsp;&nbsp;#가성비</span>
                        </div>
                    </div>
                </div>
                <div className={styles.filterSortSection}>
                    <div className={styles.keywordsFilter}>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('목넘김') ? styles.selected : ''}`}
                            onClick={() => filterReviews('목넘김')}
                        >
                            #목넘김
                        </button>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('휴대성') ? styles.selected : ''}`}
                            onClick={() => filterReviews('휴대성')}
                        >
                            #휴대성
                        </button>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('간편 섭취') ? styles.selected : ''}`}
                            onClick={() => filterReviews('간편 섭취')}
                        >
                            #간편 섭취
                        </button>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('가성비') ? styles.selected : ''}`}
                            onClick={() => filterReviews('가성비')}
                        >
                            #가성비
                        </button>
                    </div>
                    <div className={styles.sortOptions}>
                        <select id="sort-select" className={styles.sortSelect} onChange={sortReviews}>
                            <option value="truthscore">신뢰도순</option>
                            <option value="rating_desc">평점 높은순</option>
                            <option value="rating_asc">평점 낮은순</option>
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                        </select>
                    </div>
                </div>
                <div id="review-list" className={styles.reviewList}>
                    {displayReviews()}
                </div>
                <div className={styles.pagination} id="pagination">
                    {updatePagination(filteredReviewsCount)}
                </div>
            </div>
            <div className={styles.siteInformation}>
                <p className={styles.siteInformationText}>이용약관 개인정보처리방침 ⓒ JellyFishView Corp.</p>
            </div>
        </div>    
    );
};

interface Review {
    id: number;
    rating: number;
    text: string;
    source: string;
    keywords: string[];
    image_url: string;
    date: string;
}

const initialReviews: Review[] = reviewsData;
    // 리뷰 데이터 그대로 유지

export default ProductPage;
