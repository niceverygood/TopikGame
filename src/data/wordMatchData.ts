import type { MatchCard } from '../types/game';

// Level 1: Same word matching (3x4 grid = 12 cards = 6 pairs)
export const wordMatchLevel1: MatchCard[] = [
  { id: 1, type: 'word', content: '사과', pairId: 1 },
  { id: 2, type: 'word', content: '사과', pairId: 1 },
  { id: 3, type: 'word', content: '바나나', pairId: 2 },
  { id: 4, type: 'word', content: '바나나', pairId: 2 },
  { id: 5, type: 'word', content: '학교', pairId: 3 },
  { id: 6, type: 'word', content: '학교', pairId: 3 },
  { id: 7, type: 'word', content: '가족', pairId: 4 },
  { id: 8, type: 'word', content: '가족', pairId: 4 },
  { id: 9, type: 'word', content: '친구', pairId: 5 },
  { id: 10, type: 'word', content: '친구', pairId: 5 },
  { id: 11, type: 'word', content: '선생님', pairId: 6 },
  { id: 12, type: 'word', content: '선생님', pairId: 6 },
];

// Level 4: Word-meaning matching (4x4 grid = 16 cards = 8 pairs)
export const wordMatchLevel4: MatchCard[] = [
  { id: 1, type: 'word', content: '사과', pairId: 1 },
  { id: 2, type: 'meaning', content: '빨간 과일', pairId: 1 },
  { id: 3, type: 'word', content: '학교', pairId: 2 },
  { id: 4, type: 'meaning', content: '공부하는 곳', pairId: 2 },
  { id: 5, type: 'word', content: '비행기', pairId: 3 },
  { id: 6, type: 'meaning', content: '하늘을 나는 탈것', pairId: 3 },
  { id: 7, type: 'word', content: '의사', pairId: 4 },
  { id: 8, type: 'meaning', content: '병원에서 일하는 사람', pairId: 4 },
  { id: 9, type: 'word', content: '김치', pairId: 5 },
  { id: 10, type: 'meaning', content: '한국 전통 음식', pairId: 5 },
  { id: 11, type: 'word', content: '도서관', pairId: 6 },
  { id: 12, type: 'meaning', content: '책을 빌리는 곳', pairId: 6 },
  { id: 13, type: 'word', content: '컴퓨터', pairId: 7 },
  { id: 14, type: 'meaning', content: '인터넷을 하는 기계', pairId: 7 },
  { id: 15, type: 'word', content: '냉장고', pairId: 8 },
  { id: 16, type: 'meaning', content: '음식을 차갑게 보관', pairId: 8 },
];

// Level 6: Word-context matching (4x6 grid = 24 cards = 12 pairs)
export const wordMatchLevel6: MatchCard[] = [
  { id: 1, type: 'word', content: '마시다', pairId: 1 },
  { id: 2, type: 'context', content: '물을 ___', pairId: 1 },
  { id: 3, type: 'word', content: '읽다', pairId: 2 },
  { id: 4, type: 'context', content: '책을 ___', pairId: 2 },
  { id: 5, type: 'word', content: '먹다', pairId: 3 },
  { id: 6, type: 'context', content: '밥을 ___', pairId: 3 },
  { id: 7, type: 'word', content: '보다', pairId: 4 },
  { id: 8, type: 'context', content: '영화를 ___', pairId: 4 },
  { id: 9, type: 'word', content: '듣다', pairId: 5 },
  { id: 10, type: 'context', content: '음악을 ___', pairId: 5 },
  { id: 11, type: 'word', content: '가르치다', pairId: 6 },
  { id: 12, type: 'context', content: '학생을 ___', pairId: 6 },
  { id: 13, type: 'word', content: '배우다', pairId: 7 },
  { id: 14, type: 'context', content: '한국어를 ___', pairId: 7 },
  { id: 15, type: 'word', content: '입다', pairId: 8 },
  { id: 16, type: 'context', content: '옷을 ___', pairId: 8 },
  { id: 17, type: 'word', content: '신다', pairId: 9 },
  { id: 18, type: 'context', content: '신발을 ___', pairId: 9 },
  { id: 19, type: 'word', content: '타다', pairId: 10 },
  { id: 20, type: 'context', content: '버스를 ___', pairId: 10 },
  { id: 21, type: 'word', content: '만나다', pairId: 11 },
  { id: 22, type: 'context', content: '친구를 ___', pairId: 11 },
  { id: 23, type: 'word', content: '쓰다', pairId: 12 },
  { id: 24, type: 'context', content: '편지를 ___', pairId: 12 },
];

export const shuffleCards = (cards: MatchCard[]): MatchCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
