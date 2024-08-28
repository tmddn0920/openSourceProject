'''
파이썬 셀레니움을 이용해서, 쿠팡 쇼핑몰의 각 제품의 리뷰, 별점, 이미지를 수집하는 코드입니다.
'''
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime, timedelta
import time
import re
import os

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager



# 셀레니움 웹드라이버 설정
options = webdriver.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")
# options.add_argument('headless')  # 브라우저 창을 열지 않고 백그라운드에서 실행 (디버깅 시 주석 처리)
options.add_argument("window-size=1920x1080")  # 브라우저 창 크기 설정
options.add_argument("disable-gpu")  # GPU 가속 비활성화
options.add_argument("disable-infobars")  # 정보 표시줄 비활성화
options.add_argument("--disable-extensions")  # 확장 프로그램 비활성화
options.add_argument('--no-sandbox')  # 샌드박스 비활성화

# 웹드라이버 설치 및 실행
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.implicitly_wait(3)  # 암묵적 대기 시간 설정
name_list = ['쿠팡_블루다이아몬드 아몬드 브리즈 뉴트리플러스 프로틴 190ml 48개']
link_list = ['https://www.coupang.com/vp/products/7485759715?itemId=14016540715&vendorItemId=84993757615&pickType=COU_PICK&q=%EC%BF%A0%ED%8C%A1_%EB%B8%94%EB%A3%A8%EB%8B%A4%EC%9D%B4%EC%95%84%EB%AA%AC%EB%93%9C+%EC%95%84%EB%AA%AC%EB%93%9C+%EB%B8%8C%EB%A6%AC%EC%A6%88+%EB%89%B4%ED%8A%B8%EB%A6%AC%ED%94%8C%EB%9F%AC%EC%8A%A4+%ED%94%84%EB%A1%9C%ED%8B%B4+190ml+48%EA%B0%9C&itemsCount=36&searchId=ab0b883b0ade4a018c41778b5687d9b0&rank=1&isAddedCart=']
for n, link in zip(name_list, link_list):
    #데이터 얻고자 하는 대상 목록
    name = f'쿠팡_{n}_랭킹순'


    driver.get(f'{link}')  # URL 접속
    time.sleep(3)  # 페이지 로딩 대기

    # 리뷰 탭 클릭
    element1 = driver.find_element(By.XPATH, '//*[@id="btfTab"]/ul[1]/li[2]')
    driver.execute_script("arguments[0].click();", element1)
    time.sleep(3)  # 페이지 로딩 대기


    # 데이터 저장용 리스트 초기화
    number_lst = [] # 상품 리뷰 순서
    write_dt_lst = []  # 리뷰 작성일자
    star_lst = [] # 상품 별점
    content_lst = []   # 리뷰 내용

    # 이미지 저장 경로 설정 (상품명 디렉토리 생성)
    image_save_path = f'images/coupang/{name}/'
    if not os.path.exists(image_save_path):
        os.makedirs(image_save_path)

    # 페이지 소스 가져오기 및 파싱
    html_source = driver.page_source  
    soup = BeautifulSoup(html_source, 'html.parser')
    time.sleep(0.5)  # 페이지 로딩 대기

    page_num = 1  # 현재 페이지 번호
    page_ctl = 3  # 페이지 컨트롤 변수 (페이지 이동)

    # 2. BeautifulSoup으로 HTML 파싱
    soup = BeautifulSoup(html_source, 'html.parser')
    time.sleep(0.5)  # 페이지 로딩 대기



    # 날짜 기준 설정 (최근 92일) 
    date_cut = (datetime.now() - timedelta(days=183)).strftime('%Y%m%d')


    # 리뷰 수집 루프
    while True:
        print(f'start : {page_num} page 수집 중, page_ctl:{page_ctl}')
        
        # 1. 셀레니움으로 페이지 소스 가져오기
        html_source = driver.page_source
        
        # 2. BeautifulSoup으로 HTML 파싱
        soup = BeautifulSoup(html_source, 'html.parser')
        time.sleep(0.5)  # 페이지 로딩 대기
        reviews = soup.findAll('article', {'class': 'sdp-review__article__list js_reviewArticleReviewList'})
        # 3-2. 리뷰 이미지 정보 가져오기
        for i, review in enumerate(reviews):
            # 각 리뷰에서 이미지 URL 추출
            img_tags = review.findAll('img')
            for j, img_tag in enumerate(img_tags):
                img_url = img_tag['src']
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url  # 상대경로 보정
                elif not img_url.startswith('http'):
                    img_url = f'https://www.coupang.com{img_url}'  # 다른 경로 보정

                # 이미지 저장
                img_data = requests.get(img_url).content
                img_file_name = f'{image_save_path}review_{page_num}_{i+1}_{j+1}.jpg'
                with open(img_file_name, 'wb') as f:
                    f.write(img_data)
                print(f"Saved image {img_file_name}")
                if not j == 0:
                    continue
                number_lst.append(f'{page_num}_{i+1}')    
        # 4. 페이지 내 리뷰 수집
        for review in range(len(reviews)):
            # 4-0. 리뷰 별점 추출
            
            star_dt = reviews[review].findAll('div', {'class': 'sdp-review__article__list__info__product-info__star-orange js_reviewArticleRatingValue'})[0].get('data-rating')
            # 4-1. 리뷰 작성일자 추출 및 포맷팅
            write_dt_raw = reviews[review].findAll('div', {'class': 'sdp-review__article__list__info__product-info__reg-date'})[0].get_text()
            write_dt = datetime.strptime(write_dt_raw, '%Y.%m.%d').strftime('%Y%m%d')

            # 4-3. 리뷰 내용 추출 및 정리
            
            review_content_raw = reviews[review].find('div', {'class': 'sdp-review__article__list__review__content js_reviewArticleContent'})
            
            if review_content_raw is not None:

                # <br> 태그를 공백으로 대체하여 텍스트 추출
                for br in review_content_raw.find_all("br"):
                    br.replace_with(" ")

                review_content = review_content_raw.get_text(separator=" ").strip()
                review_content = re.sub(' +', ' ', review_content)  # 다중 공백을 단일 공백으로
            else:
                review_content = ""

            # 4-4. 수집된 데이터 저장
            write_dt_lst.append(write_dt)
            content_lst.append(review_content)
            star_lst.append(star_dt)

        # 리뷰 수집일자 기준으로 최근 15일 이내 데이터만 수집
        if  write_dt_lst[-1] < date_cut or page_num > 10:
            break

        # 페이지 이동
        driver.find_element(By.XPATH, f'//*[@id="btfTab"]/ul[2]/li[2]/div/div[6]/section[4]/div[3]/button[{page_ctl}]').click()
        time.sleep(3)  # 페이지 로딩 대기

        # 페이지 소스 재설정
        html_source = driver.page_source
        soup = BeautifulSoup(html_source, 'html.parser')
        time.sleep(0.5)  # 페이지 로딩 대기

        # 페이지 번호 및 컨트롤 변수 업데이트
        page_num += 1
        page_ctl += 1

        # 페이지 컨트롤 리셋 (10페이지마다)
        if page_num % 10 == 1:
            page_ctl = 3

    print('done')  # 작업 완료 메시지 출력

    # 수집된 데이터를 DataFrame으로 변환
    result_df = pd.DataFrame({
        '리뷰순서': number_lst,
        '작성일자': write_dt_lst,
        '별점': star_lst,
        '리뷰내용': content_lst
    })

    # DataFrame을 CSV 파일로 저장
    result_df.to_csv(f'./{name}_coupang_new.csv', index=None, encoding='utf-8-sig')
