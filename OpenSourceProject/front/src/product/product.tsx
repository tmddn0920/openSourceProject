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
const ProductPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviews] = useState(initialReviews);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 9;
    const [currentFilters, setCurrentFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>('tr');

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
                return reviewsArray.sort((a, b) => b.id - a.id);
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

        return paginatedReviews.map(review => (
            <div key={review.id} className={styles.reviewCard}>
                <img className={styles.reviewimage} src={review.image_url} alt="리뷰 이미지" />
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
                        <img className={styles.reviewbookmark} src={Reviewbookmark}></img>
                    </div>
                </div>
            </div>
        ));
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
                        <h1 className={styles.productName}>랩노쉬 프로틴 드링크 카카오 350ml 12개</h1>
                        <h2 className={styles.productCompany}>랩노쉬</h2>
                        <div className={styles.productImageSection}>
                            <img id="product-image" className={styles.productImage} src="https://image6.coupangcdn.com/image/vendor_inventory/421f/bd89a433d55e1ab953d99701c5561a600f110da3c68a486e299b09fb9422.jpg" alt="제품 이미지" ref={productImageRef} />
                            <button className={`${styles.arrowButton} ${styles.arrowButtonPrev}`} ref={prevButtonRef}>&#10094;</button>
                            <button className={`${styles.arrowButton} ${styles.arrowButtonNext}`} ref={nextButtonRef}>&#10095;</button>
                            <div className={styles.subImages} ref={el => subImagesRef.current = el?.querySelectorAll('img') || null}>
                                <img src="https://image6.coupangcdn.com/image/vendor_inventory/421f/bd89a433d55e1ab953d99701c5561a600f110da3c68a486e299b09fb9422.jpg" alt="서브 이미지 1" />
                                <img src="https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/1141747041823647-4cbd988c-a209-48e8-9a49-f0150b0302ac.jpg" alt="서브 이미지 2" />
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
                                    <p><span>4.84</span></p>
                                </div>
                            </div>
                        </div>
                        <div id="reviews">
                            <p className={styles.review}>"식사 대용으로 적합하다"</p>
                            <p className={styles.review}>"목넘김이 좋다"</p>
                            <p className={styles.review}>"소화에 부담이 없고 가격이 합리적이다"</p>
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
                            <p className={styles.safetyRatingResult}>안전</p>
                            <p className={styles.safetyRatingExplanation}>해피리뷰 프로그램이 판별한 결과 해당 제품은 투명해요!</p>
                        </div>
                    </div>
                    <div className={styles.relatedNews}>
                        <h2>관련 뉴스</h2>
                        <ul id="news-list" className={styles.newsList}>
                            <li>
                                <a href="https://www.pinpointnews.co.kr/news/articleView.html?idxno=272598" id="news1" className={styles.newsItem}>
                                    <img src = "https://cdn.pinpointnews.co.kr/news/photo/202406/272598_279100_3127.png" alt="뉴스 이미지 1" className={styles.newsImage} />
                                    <div className={styles.newsContent}>
                                        <span className={styles.newsTitle}>네고왕x랩노쉬’ 단백질 네고 성공…최대 66% 할인</span>
                                        <p className={styles.newsDescription}>단백질 전문 브랜드 랩노쉬가 지난 6월 20일 에이앤이코리아 달라스튜디오 웹 예능 프로그램 '네고왕'에 출연해 대대적인 할인 프로모션을 진행..</p>
                                        <span className={styles.newsSource}>핀포인트뉴스</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.m-i.kr/news/articleView.html?idxno=1031982" id="news2" className={styles.newsItem}>
                                    <img src="https://cdn.m-i.kr/news/photo/202307/1031982_795611_259.jpg"alt="뉴스 이미지 2" className={styles.newsImage} />
                                    <div className={styles.newsContent}>
                                        <span className={styles.newsTitle}>이그니스, ‘랩노쉬 프로틴 드링크’ 누적 판매량 1000만병 돌파</span>
                                        <p className={styles.newsDescription}>‘스트로베리맛’ 한 달간 110만병 판매고…단백질 함량 27g, 시판 단백질음료 중 최대..</p>
                                        <span className={styles.newsSource}>매일일보</span>
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
                                <div className={styles.productInfoCellContent} id="product-number">20070443110559</div>
                                <div className={styles.productInfoCellHeader}>상품상태</div>
                                <div className={styles.productInfoCellContent} id="product-status">신상품</div>
                            </div>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>제조사</div>
                                <div className={styles.productInfoCellContent} id="manufacturer">(주)이그니스</div>
                                <div className={styles.productInfoCellHeader}>브랜드</div>
                                <div className={styles.productInfoCellContent} id="brand">랩노쉬</div>
                            </div>
                            <div className={styles.productInfoRow}>
                                <div className={styles.productInfoCellHeader}>모델명</div>
                                <div className={styles.productInfoCellContent} id="model-name">랩노쉬 프로틴 드링크 카카오</div>
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
                                <div className={styles.productInfoCellContent} id="solid-content">27g</div>
                                <div className={styles.productInfoCellHeader}>당류 함량</div>
                                <div className={styles.productInfoCellContent} id="ginseng-content">6g</div>
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
                            <h2 className={styles.ratingAverage}>4.84 <span className={styles.averageRating}>/ 5</span></h2>
                        </div>
                        <div className={styles.reviewCount}>
                            <span id="review-count-info" className={styles.reviewCountInfo}>전체 리뷰 수</span>
                            <img id="review-icon" className={styles.reviewIcon} src={ReviewIcon} alt="review icon" />
                            <span id="review-count" className={styles.reviewCountNumber}>225</span>
                        </div>
                        <div className={styles.keywordsSummary}>
                            <span id="keywords-summary" className={styles.keywordsSummaryTitle}>리뷰 메인 키워드</span>
                            <span className={styles.keywords}>#섭취 편의성&nbsp;&nbsp;&nbsp;&nbsp;#합리적</span>
                            <span className={styles.keywords}>#식사 대용&nbsp;&nbsp;&nbsp;&nbsp;#단백질 보충</span>
                        </div>
                    </div>
                </div>
                <div className={styles.filterSortSection}>
                    <div className={styles.keywordsFilter}>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('섭취 편의성') ? styles.selected : ''}`}
                            onClick={() => filterReviews('섭취 편의성')}
                        >
                            #섭취 편의성
                        </button>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('합리적') ? styles.selected : ''}`}
                            onClick={() => filterReviews('합리적')}
                        >
                            #합리적
                        </button>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('식사 대용') ? styles.selected : ''}`}
                            onClick={() => filterReviews('식사 대용')}
                        >
                            #식사 대용
                        </button>
                        <button
                            className={`${styles.keywordButton} ${currentFilters.includes('단백질 보충') ? styles.selected : ''}`}
                            onClick={() => filterReviews('단백질 보충')}
                        >
                            #단백질 보충
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

const initialReviews: Review[] = [
    {
        "id": 1,
        "rating": 4,
        "text": "랩노쉬 프로틴 드링크 카카오, 350ml, 6개 \n \n[배송일]2024.7.11 \n \n[맛] \n \n초코의 너무 달달한맛을 별로 안좋아하는데 랩노쉬 드링크 \n카카오는 너무 달지 않고 적당한 단맛에 단백질의 텁텁한 맛이 안나서 먹기 좋았어요 \n \n간식용으로 먹기 좋고 달달한 음료 먹고싶을때 먹기 딱 좋네요 \n다른 제품 초코 프로틴음료 같은경우는 너무 달아서 먹기 \n힘들었는데 여기제품은 너무 달지 않네요 \n \n[간편함] \n \n물을 타먹거나 우유를 넣지 않아도 그냥 바로 먹을수 있어서 \n그점도 간편하고 편리하네요 \n \n특히 밖에서 바로 먹을수 있어서 좋았어요 \n \n[아쉬운점] \n \n음료안에 약간 씹는맛이 있으면 더 좋을 거 같아요 \n음료만 있다보니 약간에 허전함이 있네요 \n \n배고플때 먹으면 배고픔이 사라지지 않아요 \n \n \n제글이 작은도움 됬으면 좋겠네요^^",
        "source": "쿠팡",
        "keywords": [
            "섭취 편의성"
        ],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack1.jpg"),
        "date": "2024-08-11"
    },
    {
        "id": 2,
        "rating": 5,
        "text": "재구매했습니다 \n몇년동안 프로틴음료를 마셔왔지만 \n진짜 그 특유 느끼한맛때문에 적응이안됐는데 \n랩노쉬는 한끗다른맛입니다. \n타제품들보다 고함량의 단백질이들었는데 특유맛은 \n덜하니 신기할 따름입니다. \n \n맛자체가 단백질냄새를 잘잡았어요. \n여기꺼 27그램짜리로나온 4가지맛 다먹고있는데 \n그전에 먹던것들도 이만하면 다괜찮다는 생각으로 \n마셨지만 랩노쉬꺼는 맛있게 먹고있습니다. \n초코는 아주약간만 특유맛이나요. \n라떼나.딸기는 조금 더 덜합니다.입맛은 다다르지만 \n제기준에는 그렇네요. \n \n카카오맛은 평범하게 우유베이스에 코코아탄맛인데 \n대체감미료맛이 덜나서 아주달다 이런느낌이없고 \n초코자체가 좀 달라요.몬가 고급지다? \n약간 밍밍한 초코우유같은맛인데 아쥬 맛있음. \n목넘김이 부드럽구요. \n \n저번 6개묶음 하나짜리사보고 이번에는 2팩사두었네요. \n맛별로 골고루마시려고 다 사려니 저렴한건 아니라 \n쪼큼은 부담인데 마셔봐야 하루 1~2개인거 \n단백질 채우면서 \n고칼슘에 식이섬유까지 들었으니 건강을위해 마신다생각하면 \n우리가족을 위한 투자로 괜찮습니다. \n예전 티비보니 \n하루 필요단백질을 함량이 젤높은 소고기로 채우면 간단하지않나? \n이런 내용을본적이있는데 부자도 아니고 매일 소고기등을 \n먹을수는없는게 현실이죠. \n대안으로 랩노쉬도 적지않은 단백질함량이니 \n일상 밥먹으면서 부족해질수있는 단백질을 채워줄수있는 \n간편함.괜찮은 맛으로 추천합니다. \n \n단연코 제가 지금껏 먹었던 프로틴음료중 랩노쉬가 \n가장 편안한맛으로 제일 맛있고 \n근데 후기쓰러들어오니 제가샀을때보다 \n조금더 쎄일하네요~허허.다음번에는 \n놓치지말아야겠습니다.",
        "source": "쿠팡",
        "keywords": [
            "섭취 편의성"
        ],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack2.jpg"),
        "date": "2024-02-05"
    },
    {
        "id": 3,
        "rating": 5,
        "text": "평점: ⭐️⭐️⭐️⭐️⭐️ (5/5) \n \n리뷰: \n \n✅ 맛: 랩노쉬 프로틴 드링크 카카오는 진한 카카오 맛이 일품입니다. 초콜릿 애호가라면 누구나 좋아할 만한 깊고 풍부한 맛을 자랑합니다. 단맛이 적당히 조절되어 있어 부담 없이 즐길 수 있습니다. \n \n✅ 영양성분: 한 병에 고단백, 저지방의 영양성분이 가득 담겨 있어, 운동 후 회복 식사나 바쁜 아침 식사 대용으로 이상적입니다. 식이섬유와 비타민, 미네랄이 포함되어 있어 하루 필요한 영양소를 간편하게 섭취할 수 있습니다. \n \n✅ 편리성: 휴대하기 편한 크기와 간편하게 마실 수 있는 디자인 덕분에 언제 어디서나 빠르게 에너지를 충전할 수 있습니다. 따로 준비할 필요 없이 바로 마실 수 있어 바쁜 일상 속에서도 유용합니다. \n \n✅ 포만감: 한 병만으로도 충분한 포만감을 느낄 수 있습니다. 식사 대용으로도 손색이 없으며, 다이어트 중인 분들이나 간편한 간식을 찾는 분들에게 적합합니다. \n \n✅ 소화 용이성: 유당을 포함하지 않아 유당불내증이 있는 사람들도 안심하고 마실 수 있습니다. 소화가 잘 되며 속이 더부룩하지 않아 부담 없이 섭취할 수 있습니다. \n \n✅ 디자인: 깔끔하고 세련된 디자인의 병은 시각적으로도 만족감을 줍니다. 병에 들어 있는 양도 적당하여 한 번에 마시기 좋습니다. \n \n종합 평가: 랩노쉬 프로틴 드링크 카카오는 맛, 영양, 편리성, 포만감, 소화 용이성, 디자인 모든 면에서 우수한 제품입니다. 운동 후 단백질 보충이 필요할 때, 바쁜 아침 식사 대용으로, 또는 건강한 간식으로도 최적의 선택입니다. 맛있고 영양가 높은 프로틴 드링크를 찾고 있다면 이 제품을 강력히 추천합니다.",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack3.jpg"),
        "date": "2024-07-28"
    },
    {
        "id": 4,
        "rating": 5,
        "text": "프로틴 드링크라니, 어쩐지 운동하는 사람들만 마셔야 할 것 같은 편견이 있었죠. 하지만 오늘, 그 편견을 단숨에 날려버린 한 잔을 소개합니다. 바로 랩노쉬 프로틴 드링크 카카오맛! 이건 단순한 음료가 아니에요. 초콜릿의 신세계가 펼쳐지는 순간을 여러분께 공유해드리고 싶어요. \n \n첫 인상: \"오, 너 좀 매력있다?\" \n포장을 열자마자 느껴지는 진한 카카오의 향기! 마치 \"나 좀 맛있지 않니?\" 라고 말하는 듯한 당당한 초콜릿의 풍미가 코끝을 간지럽히더군요. 프로틴 드링크에서 이런 향이 난다고? 이미 반쯤 매료된 상태로 첫 모금을 마셨습니다. \n \n맛: \"이거 진짜 초콜릿 맞아?\" \n와, 한 모금 마셨는데 세상에 이런 일이! 초콜릿 밀크쉐이크를 마시는 듯한 그 부드럽고 진한 맛. 하지만 놀라운 건 그 부드러움 속에 숨어있는 탄탄한 단백질의 존재감이에요. 보통 단백질 음료라 하면 떠오르는 그 텁텁한 느낌은 전혀 없습니다. 오히려 초콜릿의 달콤함과 부드러움이 조화를 이루면서 입안 가득 퍼지는 이 기분, 음, 이건 꼭 마셔봐야 알아요. \n \n영양성분: \"맛있기만 하면 반칙이지!\" \n그렇다면 이 놀라운 맛 뒤에 숨겨진 영양성분은 어떨까요? 단백질 27g, 당연히 운동 후 근육 회복에 탁월한 선택이죠. 그런데도 칼로리는 적당하고, 설탕 함유량은 놀랍게도 적습니다. 더군다나 bcaa와 아르기닌까지 첨가되어있기도 하고 이렇게 완벽한데 “정말 맛있기만 한 건 아니네”라는 생각이 들더군요. 아, 이쯤 되면 영양성분표도 맛있어 보이는 건 저만 그런 걸까요? \n \n총평: \"초콜릿과 단백질의 완벽한 만남\" \n랩노쉬 프로틴 드링크 카카오맛은 단지 맛있기만 한 음료가 아닙니다. 맛과 건강을 동시에 챙기고 싶은 분들께 완벽한 선택이죠. 운동 전후나 바쁜 아침에 한 잔이면 하루가 든든할 거예요. \"이 정도면 초콜릿이 아니라 작품이다!\"라고 감탄하게 만드는 매력적인 드링크, 여러분도 꼭 한번 시도해보세요. \n \n초콜릿의 세계에 빠져드는 그 순간, 당신도 분명 \"이거, 계속 마셔도 되나?\"라는 생각이 들 테니까요! \n \n아주 주관적인 리뷰이므로 타 리뷰도 읽어보시고 구매에 도움되었으면 좋겠습니다 \n \n이 리뷰가 도움이 되었다면 밑에 도움버튼 한번 눌러주시면 감사하겠습니다 . ^^",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack4.jpg"),
        "date": "2024-06-15"
    },
    {
        "id": 5,
        "rating": 5,
        "text": "❤ 랩노쉬 프로틴 드링크 카카오맛 너 나랑 평생 가자!!! \nㅡ랩노쉬 프로틴 드링크 너... 커피맛 빼고 초코맛, 딸기맛, 바나나맛, 요즘 신상으로 나온 멜론맛까지 다 먹어봤는데 전부 다 맛있더라?ㅎㅎ커피는 내가 원래도 커피중독자라 이미 너무 많이 마시고 있어서 안샀어.. 하지만 안먹어봐도 커피맛도 맛있을것같아. \nㅡ랩노쉬 프로틴 드링크 카카오 너는 진짜 내 다이어트의 혁명템이야. 내가 살빼려고 달달한 프로틴 드링크 사먹기 시작한지 1년 넘었잖아??!! 그동안 다양한 프로틴 드링크 시리즈 다양한 맛을 시도해봤었거든...근데 랩노쉬 프로틴 드링크 진짜 너만한 애가 없더라... 일단 너만큼 맛있는 애가 없어...그래서 너랑 평생갈 거야. \n \n❤다른 브랜드 프로틴 드링크는 뭔가 끝맛이 텁텁하던데 랩노쉬 너는 텁텁함이 없더라? 그냥 일반 초코우유같아!!! \nㅡ프로틴 드링크 뭐니뭐니해도 맛이 있어야 꾸준히 마실수 있잖아? 그런면에서 이 달콤한 랩노쉬 프로틴 드링크 카카오맛은 정말 독보적이야! \n \n❤랩노쉬 프로틴 드링크 스트로베리 넌 그냥 일반 초코우유 맛이랑 똑같더라구!!! 어떻게 어쩜 초코우유 진짜 이 맛을 구현해내지? 넌 내 다이어트의 한줄기 빛이야!! = \nㅡ와... 진짜 그냥 초코 우유 맛이랑 똑같아..당충전 제대로야..그냥 초코우유 마시듯이 마시면 프로틴도 섭취하고 어찌나 좋은지... 세상 진짜 좋아졌어 \n \n❤프로틴드링크가 어쩜 이렇게 신선하고 달달하고 깊은 맛을 내는지 놀라워! \nㅡ나 처음 먹고 충격적으로 맛있어서 놀랐잖아.... 달달하면서도 풍미가 풍부한 초코우유맛이랑 그냥 똑같아. 일단 음료라고 하면 맛이 제일 중요하잖아.. 어떻게 프로틴 음료가 이렇게 진짜 초코우유처럼 신선하고 맛있을 수 있는지 정말 놀라워! \n \n❤프로틴이다 보니까 포만감이 많이 들어서 이거 먹고 나면 다른 군것질 생각이 안나!! \nㅡ과자, 당이 든 음료, 아이스크림이 땡길때 대용으로 먹기 좋아! 초코우유 느낌이 달달해서 과자와 아이스크림 욕구를 잠재울 수 있어서 다이어트에 진짜 도움돼!! 나 간식땡길때마다 랩노쉬 이거 먹고 3kg 뺐어!!",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack5.jpg"),
        "date": "2024-05-13"
    },
    {
        "id": 6,
        "rating": 5,
        "text": "바쁜 아침, 식사대용으로 마시려고 랩노쉬 프로틴 드링크 카카오, 350ml. 6개 구입했어요 \n \n☘️☘️160kcal의 저칼로리, 포만감, 고칼슘식이섬유, 우유+완전단백질, 고단백질, 필수아미노산3종까지!! \n \n바쁘게 밥상 차리는 것 보다 훨 나은 것 같아요 \n \n☘️☘️특히 운동, 다이어트하면서 단백질섭취에 고민하고 있다면 \n \n이 제품 좋은 것 같아요~ \n \n저는 딸이 먼저 마셔보고 추천해준 프로틴드링크라 계속해서 마셔볼 생각입니다^^ \n \n☘️☘️게다가 비린맛이 느껴지지 않을만큼 고소하고 맛있어요 \n \n \n제 리뷰가 제품선택에 도움이 되셨다면 \n도움이돼요 눌러주시길 부탁드릴께요~^^",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack6.jpg"),
        "date": "2024-08-12"
    },
    {
        "id": 7,
        "rating": 5,
        "text": "### 제품 소개: 랩노쉬 프로틴 드링크 카카오 \n안녕하세요! 제가 최근 발견한 단백질 음료 중 단연 최고라고 생각하는 랩노쉬 프로틴 드링크 카카오를 소개하려고 해요. 쿠팡에서 발견한 이 제품은 한 병에 무려 27g의 고단백질을 자랑하며, 단백질 함량이 가장 높은 제품이랍니다. \n \n### 운동 후에 완벽한 선택 \n근력운동을 즐기는 저에게 이 음료는 운동 후 필수 보충제가 되었어요. 단백질 특유의 비린맛 없이 포만감을 주기 때문에 식사 대용으로도 아주 좋습니다. \n \n### 건강을 생각하는 성분 구성 \n랩노쉬 프로틴 드링크는 저당, 무지방, 저칼로리(160kcal)로 구성되어 있어요. 건강을 신경 쓰시는 분들이나 다이어트 중인 분들에게도 안성맞춤입니다. \n \n### 맛의 특징: 카카오의 달콤함 \n카카오 맛 덕분에 달콤하면서도 깊은 맛을 즐길 수 있어요. 단백질 음료를 좋아하지 않았던 저도 이 제품은 정말 좋아하게 되었답니다. \n \n### 사용 추천 \n저는 이 제품을 아침 식사 대용이나 운동 후 회복 음료로 마시는 것을 특히 추천드려요. 바쁜 일상 속에서도 영양 균형을 쉽게 맞출 수 있어요. \n \n### 재구매 의사 및 마무리 \n6개입 구성 덕분에 한 번 구매로 일주일 가까이 걱정 없이 섭취할 수 있어서 너무 좋습니다. \n \n저는 이미 재주문을 했어요! 단백질 음료를 찾고 계신다면, 랩노쉬 프로틴 드링크 카카오를 꼭 시도해보시길 바랍니다. 건강한 일상을 위한 작은 변화가 될 거예요. 감사합니다!",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack7.jpg"),
        "date": "2024-03-07"
    },
    {
        "id": 8,
        "rating": 5,
        "text": "❤️제글에 도움이 되셨다면 도움이 돼요❤️ \n눌러주시면 저에케 큰 힘이 됩니다. \n \n저도 구매평을 많이 참고하고 구매하는 편이라, 다른 글에 \n도움이 돼요 막막 누르고 다닙니다 ㅎㅎ \n \n평점: ⭐️⭐️⭐️⭐️⭐️ (5/5) \n \n리뷰: \n \n✅ 맛: 랩노쉬 프로틴 드링크 카카오는 풍부한 카카오 맛이 돋보입니다. 진한 초콜릿 향과 함께 고소하고 부드러운 맛을 선사합니다. 달달한 맛이 강하지 않아 적당히 달콤하면서도 지나치게 달지 않아서 좋습니다. \n \n✅ 텍스처: 드링크의 텍스처는 부드럽고 무겁지 않아서 마시기에 편안합니다. 적당한 농도와 부드러운 질감이 입안에서 잘 녹아내려 마시는 과정이 즐거움을 줍니다. \n \n✅ 영양성분: 프로틴 드링크로서 단백질 함량이 풍부하고, 지방 및 탄수화물 함량이 적당하여 영양 균형이 잘 맞춰져 있습니다. 운동 후의 회복이나 간식으로 섭취하기에 이상적입니다. \n \n✅ 효율성: 휴대하기 쉬운 패키지로 제공되어 언제 어디서나 손쉽게 섭취할 수 있습니다. 특히 바쁜 아침이나 운동 후에 효율적으로 영양소를 보충할 수 있어서 편리합니다. \n \n✅ 종합 평가: 랩노쉬 프로틴 드링크 카카오는 맛, 텍스처, 영양성분 측면에서 모두 뛰어난 제품입니다. 휴대성과 효율성을 고려할 때, 저는 이 제품을 강력히 추천합니다.",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack8.jpg"),
        "date": "2024-04-29"
    },
    {
        "id": 9,
        "rating": 5,
        "text": "✌️ 솔직하게 쓰는 리뷰 ✌️ \n \n173cm / 근력 26kg / 체지방 13kg / 40대 중반 \n \n운동을 꾸준히 하는 40대 줌마입니다~ \n오래전 단배질파우더 직구까지 하며 정말 맛없던 파우더 먹던 1인 이에용 \n \n타먹는게 귀찮을때쯤 단백질음료들이 나오기시작하면서 편의점과 시중에 파는 단백질음료는 다 먹어봤을정도로 근력을 지키려고 꾸준히 운동하고 \n먹고 있습니다. \n \n내가느낀 단백질 음료 부족한점,아쉬운점 \n○ 단백질 음료의 걸쭉한 식감 \n○ 부족한 단백질용량 \n○ 특유의 단백질 냄새 \n○ 다른보충제를 따로 먹는 불편함 등(bcaa,크레아틴,류신,아르기닌 등) \n○ 밍밍하거나 너무 달거나 \n \n랩노쉬를 알고나서 제가 단백질음료를 먹으면서 느낀 \n부족하고 아쉬웠던 점을 모조리 해결한 음료라 정말 강추합니다 \n \n맛은 단백질음료가 맞아? 할정도로 단백질 특유의냄새와 걸쭉함이 전혀 없답니다. 그리고 너무 맛있어요.♡ \n딸기,라떼.카카오,바나나 다 먹어봤구요 \n많이 달지않은 딸기우유 먹는맛입니다. \n바나나도 그럴꺼라 생각하고 먹었는데 넘 밍밍해서 제입맛엔 \n딸기>라떼>카카오>바나나 순입니다 \n몆년전 바디프로필 찍을때 랩노쉬가 있었음 더 맛있게 다이어트 했었을텐데 하는 생각이 들더라고요. \n \n용량 350미리 단백질함량 무려 27그람♡ \n여기에 bcaa, 아르기닌,식이섬유까지 랩노쉬 한병이면 충분합니다. \n \n용량은 350으로 정말 든든해요 \n(용량이 많다 느끼는분들 200미리용량 있어요. 맛은 다른2가지-마지막사진) \n \n▶단점 \n비싸다!!!!! \n저렴이 먹는건 편의점에서 2+1 할때 개당 이천백삼십원꼴로 행사할때아님 비쌈. \n그래서 전 쿠팡으로 시켜요 편의점까지 갈필요없고 쿠팡서는 할인폭이 그때 그때 다르지만 보통 6개 만오천원대로 개당 가격 나쁘지않으니까요 \n12개는 더 싸지니까 더 좋겠죵 \n전 5가지맛으로 시키느라 6개들이로 구매했어묘",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack9.jpg"),
        "date": "2024-01-16"
    },
    {
        "id": 10,
        "rating": 5,
        "text": "mbti \nt가 추천하는 단백질 드링크 \n \n1. 구매 목적 \n요세 다이어트 및 근향상을위해 헬스장을 다녀, 휴대용으로 간단하게 \n운동후 먹을수있는 단백질보충제를 찾는중 \n쉐이크 통없이 간단하게 흔들어서 \n먹을수있는 단백질음료라 구매하게됨 \n \n특히. 요세 나오는 마시는 단백질 드링크음료 볼경우 \n매일유업, 빙그레등 많은대기업이 있으나 \n이제품은 맛자체가 너무 맛있다고 유명하여 구매함. \n맛 중요!!! 다먹고살기위한거니. \n \n2.맛 \n해당 상품 카카오, 커피, 딸기, 바나나등있는데 \n본인은 카카오, 커피, 딸기를 먹어봤으며, \n가장무난한 카카오를 가장추천함. \n \n솔직히 맛이 그렇게 뛰어난건아니지만, \n그래도 무난한건 역시 카카맛이라 생각함. \n사람들이 진짜 초코우유맛이라고하는데 그정도까진 아니고 \n당류가 6g있어 어느정도 달달함. 만족하고 먹는중 \n \n3. 장점 \n랩노쉬 프로틴 드링크 카카오의장점은 \n무지방, 저당, 저칼로리(160kccal), 다른 단백질은대부분20g인데 이제품은 27g이고 포만감도 식사대용느낌나왔다보니350ml라 높고 식이섬유가있어서 다이어트하더라도 걱정없이 마실수있는 그런느낌 \n \nbcaa는 솔직히 단백질보충 자체에 \n어느정도는 다있다 생각하고 단백질 드링크중에 없는 상품이없는것같아서 특별하다는 모르겠고 그냥저냥임. \n \n그래도 중요한 단백질은 식물단백질이아닌 우유단백으로 \n저렴한 단백질드링크제를 볼경우 \n식물성 이거나 식물성과 유단백을 반반 하는경우가많음. \n이제품은 유단백이라 만족 \n \n4. 단점 \n직접 쉐이크통에 넣고 혼들어먹는게아니라 \n미리 잘섞여있어야하니 유화제가 들어가있음 \n \n위 언급한내용처럼 맛있다고하는이유는 \n당분(과당)이 6g 있음 \n구지 당을 섭취할때많은데 단백질음료에서 먹어야하나싶음. \n(몇몇 가루 단백질 보충제의 경우 가루자체에 당류가 포함된게 많기는함) \n1g이하의 제품도 있기때문에 단점으로생각하며 종료 \n \n그래도 만족하고 먹을수있는 간단한 섭취좋은 단백질 추천",
        "source": "쿠팡",
        "keywords": [],
        "image_url": require("./CoupangLapsnoshProteinDrinkCocoa350ml12pack10.jpg"),
        "date": "2024-01-15"
    }
];
    // 리뷰 데이터 그대로 유지

export default ProductPage;
