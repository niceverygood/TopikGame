import type { OddOneOutQuestion } from '../types/game';

export const oddOneOutQuestions: OddOneOutQuestion[] = [
  {
    items: [
      { text: "사과", icon: "🍎", category: "과일" },
      { text: "바나나", icon: "🍌", category: "과일" },
      { text: "포도", icon: "🍇", category: "과일" },
      { text: "의자", icon: "🪑", category: "가구" }
    ],
    oddOne: "의자",
    rule: "나머지는 모두 과일입니다."
  },
  {
    items: [
      { text: "강아지", icon: "🐕", category: "동물" },
      { text: "고양이", icon: "🐈", category: "동물" },
      { text: "토끼", icon: "🐰", category: "동물" },
      { text: "자동차", icon: "🚗", category: "탈것" }
    ],
    oddOne: "자동차",
    rule: "나머지는 모두 동물입니다."
  },
  {
    items: [
      { text: "연필", icon: "✏️", category: "문구" },
      { text: "지우개", icon: "🧽", category: "문구" },
      { text: "가위", icon: "✂️", category: "문구" },
      { text: "피자", icon: "🍕", category: "음식" }
    ],
    oddOne: "피자",
    rule: "나머지는 모두 문구류입니다."
  },
  {
    items: [
      { text: "축구", icon: "⚽", category: "스포츠" },
      { text: "야구", icon: "⚾", category: "스포츠" },
      { text: "농구", icon: "🏀", category: "스포츠" },
      { text: "기타", icon: "🎸", category: "악기" }
    ],
    oddOne: "기타",
    rule: "나머지는 모두 스포츠입니다."
  },
  {
    items: [
      { text: "봄", icon: "🌸", category: "계절" },
      { text: "여름", icon: "☀️", category: "계절" },
      { text: "가을", icon: "🍂", category: "계절" },
      { text: "월요일", icon: "📅", category: "요일" }
    ],
    oddOne: "월요일",
    rule: "나머지는 모두 계절입니다."
  },
  {
    items: [
      { text: "빨강", icon: "🔴", category: "색상" },
      { text: "파랑", icon: "🔵", category: "색상" },
      { text: "노랑", icon: "🟡", category: "색상" },
      { text: "세모", icon: "🔺", category: "모양" }
    ],
    oddOne: "세모",
    rule: "나머지는 모두 색깔입니다."
  },
  {
    items: [
      { text: "의사", icon: "👨‍⚕️", category: "직업" },
      { text: "선생님", icon: "👨‍🏫", category: "직업" },
      { text: "요리사", icon: "👨‍🍳", category: "직업" },
      { text: "서울", icon: "🏙️", category: "도시" }
    ],
    oddOne: "서울",
    rule: "나머지는 모두 직업입니다."
  },
  {
    items: [
      { text: "눈", icon: "👁️", category: "신체" },
      { text: "코", icon: "👃", category: "신체" },
      { text: "입", icon: "👄", category: "신체" },
      { text: "책상", icon: "📚", category: "가구" }
    ],
    oddOne: "책상",
    rule: "나머지는 모두 신체 부위입니다."
  },
  {
    items: [
      { text: "아침", icon: "🌅", category: "시간" },
      { text: "점심", icon: "☀️", category: "시간" },
      { text: "저녁", icon: "🌆", category: "시간" },
      { text: "한국", icon: "🇰🇷", category: "나라" }
    ],
    oddOne: "한국",
    rule: "나머지는 모두 하루의 시간대입니다."
  },
  {
    items: [
      { text: "물", icon: "💧", category: "음료" },
      { text: "주스", icon: "🧃", category: "음료" },
      { text: "커피", icon: "☕", category: "음료" },
      { text: "신발", icon: "👟", category: "의류" }
    ],
    oddOne: "신발",
    rule: "나머지는 모두 마시는 것입니다."
  },
  {
    items: [
      { text: "하나", icon: "1️⃣", category: "숫자" },
      { text: "둘", icon: "2️⃣", category: "숫자" },
      { text: "셋", icon: "3️⃣", category: "숫자" },
      { text: "크다", icon: "📏", category: "형용사" }
    ],
    oddOne: "크다",
    rule: "나머지는 모두 숫자입니다."
  },
  {
    items: [
      { text: "걷다", icon: "🚶", category: "동사" },
      { text: "뛰다", icon: "🏃", category: "동사" },
      { text: "먹다", icon: "🍽️", category: "동사" },
      { text: "예쁘다", icon: "😍", category: "형용사" }
    ],
    oddOne: "예쁘다",
    rule: "나머지는 모두 동사입니다."
  },
];
