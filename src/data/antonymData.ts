import type { AntonymQuestion } from '../types/game';

export const antonymQuestions: AntonymQuestion[] = [
  { word: "덥다", answer: "춥다", options: ["넓다", "춥다", "작다", "높다"] },
  { word: "크다", answer: "작다", options: ["작다", "좁다", "낮다", "짧다"] },
  { word: "높다", answer: "낮다", options: ["낮다", "좁다", "짧다", "가볍다"] },
  { word: "빠르다", answer: "느리다", options: ["느리다", "가볍다", "멀다", "어둡다"] },
  { word: "무겁다", answer: "가볍다", options: ["가볍다", "작다", "낮다", "좁다"] },
  { word: "길다", answer: "짧다", options: ["짧다", "좁다", "낮다", "가볍다"] },
  { word: "넓다", answer: "좁다", options: ["좁다", "짧다", "작다", "낮다"] },
  { word: "밝다", answer: "어둡다", options: ["어둡다", "춥다", "느리다", "가볍다"] },
  { word: "많다", answer: "적다", options: ["적다", "작다", "낮다", "짧다"] },
  { word: "새롭다", answer: "낡다", options: ["낡다", "늦다", "느리다", "어둡다"] },
  { word: "기쁘다", answer: "슬프다", options: ["슬프다", "아프다", "무섭다", "지루하다"] },
  { word: "쉽다", answer: "어렵다", options: ["어렵다", "느리다", "무겁다", "길다"] },
  { word: "가깝다", answer: "멀다", options: ["멀다", "낮다", "좁다", "적다"] },
  { word: "비싸다", answer: "싸다", options: ["싸다", "낮다", "적다", "좁다"] },
  { word: "맛있다", answer: "맛없다", options: ["맛없다", "싱겁다", "짜다", "쓰다"] },
  { word: "예쁘다", answer: "못생기다", options: ["못생기다", "더럽다", "어둡다", "작다"] },
  { word: "깨끗하다", answer: "더럽다", options: ["더럽다", "어둡다", "좁다", "낮다"] },
  { word: "시끄럽다", answer: "조용하다", options: ["조용하다", "느리다", "가볍다", "좁다"] },
  { word: "두껍다", answer: "얇다", options: ["얇다", "짧다", "좁다", "낮다"] },
  { word: "강하다", answer: "약하다", options: ["약하다", "낮다", "느리다", "가볍다"] },
  // 문장 형태
  { word: "날씨가 덥다", answer: "날씨가 춥다", options: ["날씨가 춥다", "날씨가 좋다", "날씨가 맑다", "날씨가 나쁘다"] },
  { word: "값이 비싸다", answer: "값이 싸다", options: ["값이 싸다", "값이 낮다", "값이 적다", "값이 좋다"] },
  { word: "길이 넓다", answer: "길이 좁다", options: ["길이 좁다", "길이 짧다", "길이 낮다", "길이 적다"] },
  { word: "소리가 크다", answer: "소리가 작다", options: ["소리가 작다", "소리가 낮다", "소리가 좁다", "소리가 적다"] },
  { word: "산이 높다", answer: "산이 낮다", options: ["산이 낮다", "산이 좁다", "산이 짧다", "산이 작다"] },
];

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
