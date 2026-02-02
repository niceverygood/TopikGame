import type { ChosungQuestion } from '../types/game';

export const chosungQuestions: ChosungQuestion[] = [
  // 과일/음식
  { hint: "백설공주가 먹은 과일", chosung: "ㅅㄱ", answer: "사과", options: ["사과", "수박", "살구", "석류"] },
  { hint: "여름에 먹는 큰 과일", chosung: "ㅅㅂ", answer: "수박", options: ["수박", "사과", "살구", "석류"] },
  { hint: "노란색 열대 과일", chosung: "ㅂㄴㄴ", answer: "바나나", options: ["바나나", "복숭아", "배", "블루베리"] },
  { hint: "원숭이가 좋아하는 과일", chosung: "ㅂㄴㄴ", answer: "바나나", options: ["바나나", "배", "복숭아", "블루베리"] },
  { hint: "한국의 전통 음식", chosung: "ㄱㅊ", answer: "김치", options: ["김치", "갈비", "고기", "국수"] },
  { hint: "쌀로 만든 음식", chosung: "ㅂ", answer: "밥", options: ["밥", "빵", "볶음밥", "비빔밥"] },
  { hint: "밀가루로 만든 국수", chosung: "ㄹㅁ", answer: "라면", options: ["라면", "리조또", "라자냐", "로스트"] },
  { hint: "돼지고기를 구운 것", chosung: "ㅅㄱㅅ", answer: "삼겹살", options: ["삼겹살", "소고기", "생선", "새우"] },
  { hint: "매운 빨간 찌개", chosung: "ㄱㅊㅉㄱ", answer: "김치찌개", options: ["김치찌개", "감자탕", "갈비찌개", "곰탕"] },
  { hint: "여름에 먹는 차가운 것", chosung: "ㅇㅅㅋㄹ", answer: "아이스크림", options: ["아이스크림", "아이스커피", "아메리카노", "아몬드"] },
  
  // 동물
  { hint: "바다의 포식자", chosung: "ㅅㅇ", answer: "상어", options: ["상어", "소라", "새우", "성게"] },
  { hint: "빠르게 달리는 동물", chosung: "ㅊㅌ", answer: "치타", options: ["치타", "참새", "코끼리", "침팬지"] },
  { hint: "긴 목을 가진 동물", chosung: "ㄱㄹ", answer: "기린", options: ["기린", "고릴라", "개미", "거북이"] },
  { hint: "코가 긴 동물", chosung: "ㅋㄲㄹ", answer: "코끼리", options: ["코끼리", "캥거루", "코알라", "쿠거"] },
  { hint: "깡충깡충 뛰는 동물", chosung: "ㅌㄲ", answer: "토끼", options: ["토끼", "타조", "트라이앵글", "통닭"] },
  { hint: "왕왕 짖는 동물", chosung: "ㄱ", answer: "개", options: ["개", "고양이", "거북이", "곰"] },
  { hint: "야옹 우는 동물", chosung: "ㄱㅇㅇ", answer: "고양이", options: ["고양이", "개", "거미", "곰"] },
  { hint: "줄무늬가 있는 말", chosung: "ㅇㄹㅁ", answer: "얼룩말", options: ["얼룩말", "악어", "앵무새", "오리"] },
  { hint: "꿀을 만드는 곤충", chosung: "ㅂ", answer: "벌", options: ["벌", "나비", "배", "불"] },
  { hint: "바다에 사는 포유류", chosung: "ㄷㄱㄹ", answer: "돌고래", options: ["돌고래", "독수리", "다람쥐", "당나귀"] },
  
  // 장소
  { hint: "공부하는 장소", chosung: "ㅎㄱ", answer: "학교", options: ["학교", "학원", "회사", "호텔"] },
  { hint: "아픈 사람이 가는 곳", chosung: "ㅂㅇ", answer: "병원", options: ["병원", "백화점", "방앗간", "버스정류장"] },
  { hint: "책을 빌리는 곳", chosung: "ㄷㅅㄱ", answer: "도서관", options: ["도서관", "대학교", "동물원", "대형마트"] },
  { hint: "비행기를 타는 곳", chosung: "ㄱㅎ", answer: "공항", options: ["공항", "광장", "교회", "극장"] },
  { hint: "기차를 타는 곳", chosung: "ㅇ", answer: "역", options: ["역", "영화관", "은행", "약국"] },
  { hint: "돈을 맡기는 곳", chosung: "ㅇㅎ", answer: "은행", options: ["은행", "약국", "영화관", "우체국"] },
  { hint: "편지를 보내는 곳", chosung: "ㅇㅊㄱ", answer: "우체국", options: ["우체국", "약국", "영화관", "은행"] },
  { hint: "영화를 보는 곳", chosung: "ㅇㅎㄱ", answer: "영화관", options: ["영화관", "은행", "약국", "역"] },
  { hint: "물건을 사는 큰 곳", chosung: "ㅂㅎㅈ", answer: "백화점", options: ["백화점", "병원", "버스터미널", "볼링장"] },
  { hint: "커피를 마시는 곳", chosung: "ㅋㅍㅅ", answer: "카페", options: ["카페", "콘서트홀", "컨벤션센터", "캠핑장"] },
  
  // 교통
  { hint: "하늘을 나는 교통수단", chosung: "ㅂㅎㄱ", answer: "비행기", options: ["비행기", "버스", "배", "보트"] },
  { hint: "바퀴가 두 개인 것", chosung: "ㅈㅈㄱ", answer: "자전거", options: ["자전거", "자동차", "지하철", "잠수함"] },
  { hint: "땅 아래로 다니는 것", chosung: "ㅈㅎㅊ", answer: "지하철", options: ["지하철", "자동차", "자전거", "잠수함"] },
  { hint: "바다 위를 다니는 것", chosung: "ㅂ", answer: "배", options: ["배", "버스", "비행기", "보트"] },
  { hint: "많은 사람을 태우는 차", chosung: "ㅂㅅ", answer: "버스", options: ["버스", "비행기", "배", "보트"] },
  { hint: "빠른 철도 교통수단", chosung: "ㄱㅊ", answer: "기차", options: ["기차", "고속버스", "경찰차", "구급차"] },
  
  // 물건
  { hint: "밤에 빛나는 것", chosung: "ㅂ", answer: "별", options: ["별", "불", "빛", "밤"] },
  { hint: "발에 신는 것", chosung: "ㅅㅂ", answer: "신발", options: ["신발", "슬리퍼", "샌들", "스타킹"] },
  { hint: "글을 쓰는 도구", chosung: "ㅇㅍ", answer: "연필", options: ["연필", "에어컨", "얼음", "엔진"] },
  { hint: "물을 담는 그릇", chosung: "ㅋ", answer: "컵", options: ["컵", "캔", "칼", "콩"] },
  { hint: "시간을 알려주는 것", chosung: "ㅅㄱ", answer: "시계", options: ["시계", "사진", "신문", "소금"] },
  { hint: "손에 끼는 것", chosung: "ㅈㄱ", answer: "장갑", options: ["장갑", "지갑", "자판", "주걱"] },
  { hint: "머리에 쓰는 것", chosung: "ㅁㅈ", answer: "모자", options: ["모자", "목걸이", "마스크", "머리띠"] },
  { hint: "겨울에 입는 두꺼운 옷", chosung: "ㅍㅌ", answer: "패딩", options: ["패딩", "파자마", "팬츠", "풀오버"] },
  { hint: "비 올 때 쓰는 것", chosung: "ㅇㅅ", answer: "우산", options: ["우산", "의자", "옷", "안경"] },
  { hint: "전화를 하는 기기", chosung: "ㅎㄷㅍ", answer: "휴대폰", options: ["휴대폰", "헤드폰", "허리띠", "학용품"] },
  { hint: "글자를 치는 기기", chosung: "ㅋㅂ", answer: "키보드", options: ["키보드", "카메라", "컴퓨터", "캠코더"] },
  { hint: "화면을 보는 것", chosung: "ㅁㄴㅌ", answer: "모니터", options: ["모니터", "마우스", "마이크", "믹서"] },
  
  // 자연
  { hint: "동그란 채소", chosung: "ㅇㅍ", answer: "양파", options: ["양파", "오이", "애호박", "아스파라거스"] },
  { hint: "하늘에서 내리는 물", chosung: "ㅂ", answer: "비", options: ["비", "별", "바람", "번개"] },
  { hint: "겨울에 내리는 것", chosung: "ㄴ", answer: "눈", options: ["눈", "나무", "낙엽", "난초"] },
  { hint: "밤에 뜨는 것", chosung: "ㄷ", answer: "달", options: ["달", "돌", "등", "더위"] },
  { hint: "낮에 뜨는 것", chosung: "ㅎㅇ", answer: "해", options: ["해", "하늘", "호수", "햇빛"] },
  { hint: "푸른 잎이 있는 것", chosung: "ㄴㅁ", answer: "나무", options: ["나무", "나비", "낙엽", "노래"] },
  { hint: "물이 흐르는 곳", chosung: "ㄱ", answer: "강", options: ["강", "골짜기", "계곡", "고원"] },
  { hint: "높이 솟은 땅", chosung: "ㅅ", answer: "산", options: ["산", "숲", "사막", "섬"] },
  { hint: "물이 넓게 펼쳐진 곳", chosung: "ㅂㄷ", answer: "바다", options: ["바다", "박물관", "반도", "벌판"] },
  
  // 직업
  { hint: "아픈 사람을 치료하는 사람", chosung: "ㅇㅅ", answer: "의사", options: ["의사", "운동선수", "요리사", "영화배우"] },
  { hint: "학생을 가르치는 사람", chosung: "ㅅㅅㄴ", answer: "선생님", options: ["선생님", "소방관", "세일즈맨", "수의사"] },
  { hint: "불을 끄는 사람", chosung: "ㅅㅂㄱ", answer: "소방관", options: ["소방관", "선생님", "세탁소", "수영선수"] },
  { hint: "범인을 잡는 사람", chosung: "ㄱㅊ", answer: "경찰", options: ["경찰", "간호사", "기자", "군인"] },
  { hint: "맛있는 음식을 만드는 사람", chosung: "ㅇㄹㅅ", answer: "요리사", options: ["요리사", "운전사", "의사", "약사"] },
  { hint: "노래를 부르는 사람", chosung: "ㄱㅅ", answer: "가수", options: ["가수", "군인", "기자", "간호사"] },
  
  // 계절/날씨
  { hint: "꽃이 피는 계절", chosung: "ㅂ", answer: "봄", options: ["봄", "비", "밤", "별"] },
  { hint: "더운 계절", chosung: "ㅇㄹ", answer: "여름", options: ["여름", "열", "연기", "영화"] },
  { hint: "낙엽이 지는 계절", chosung: "ㄱㅇ", answer: "가을", options: ["가을", "겨울", "강", "공원"] },
  { hint: "눈이 오는 계절", chosung: "ㄱㅇ", answer: "겨울", options: ["겨울", "가을", "기온", "공기"] },
  
  // 색깔
  { hint: "하늘의 색", chosung: "ㅍㄹㅅ", answer: "파란색", options: ["파란색", "핑크색", "보라색", "풀색"] },
  { hint: "사과의 색", chosung: "ㅂㄱㅅ", answer: "빨간색", options: ["빨간색", "보라색", "분홍색", "베이지색"] },
  { hint: "바나나의 색", chosung: "ㄴㄹㅅ", answer: "노란색", options: ["노란색", "남색", "녹색", "넥타이"] },
  { hint: "풀의 색", chosung: "ㅊㄹㅅ", answer: "초록색", options: ["초록색", "청색", "주황색", "차색"] },
];
