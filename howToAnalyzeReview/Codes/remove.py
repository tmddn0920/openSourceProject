'''웹에서 소비자들이 데이터를 볼 수 있도록 리뷰 데이터를 Json 파일로 가공하는 코드'''
import os
import json

def format_date(date_str):
    """'YYYYMMDD' 형식의 문자열을 'YYYY-MM-DD' 형식으로 변환"""
    if len(date_str) == 8:
        return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}"
    return date_str


def modify_json_data(file_path):
    try:
        # 파일에서 JSON 데이터를 읽어옵니다.
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # 데이터 수정
        for item in data:
            # "id" 값을 숫자형으로 변환
            if "id" in item and isinstance(item["id"], str):
                item["id"] = int(item["id"])
            
            # "date" 값을 'YYYY-MM-DD' 형식의 문자열로 변환
            if "date" in item and isinstance(item["date"], str):
                item["date"] = format_date(item["date"])

        # 수정된 데이터를 다시 파일에 저장
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)
        
        print(f"Modified and saved: {file_path}")

    except json.JSONDecodeError:
        print(f"Error decoding JSON file: {file_path}")
    except Exception as e:
        print(f"An error occurred while processing {file_path}: {e}")

def process_json_files_in_directory(directory):
    # 디렉토리 내의 모든 파일을 순회
    for root, _, files in os.walk(directory):
        for file_name in files:
            if file_name.endswith('.json'):
                file_path = os.path.join(root, file_name)
                modify_json_data(file_path)

# 사용 방법:
# 디렉토리 경로를 설정하고 JSON 파일들을 처리
directory_path = r'C:\Users\jinwo\code\리뷰정리\비타민'
process_json_files_in_directory(directory_path)
