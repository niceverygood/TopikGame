import type { SyllableSlotQuestion } from '../types/game';

export const syllableSlotQuestions: SyllableSlotQuestion[] = [
  {
    target: "강",
    meaning: "River",
    chosung: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ"],
    jongsung: ["", "ㅇ", "ㄴ", "ㅁ", "ㄹ"],
    answer: { cho: "ㄱ", jung: "ㅏ", jong: "ㅇ" }
  },
  {
    target: "물",
    meaning: "Water",
    chosung: ["ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ"],
    jongsung: ["", "ㄹ", "ㄴ", "ㅁ", "ㅂ"],
    answer: { cho: "ㅁ", jung: "ㅜ", jong: "ㄹ" }
  },
  {
    target: "산",
    meaning: "Mountain",
    chosung: ["ㅅ", "ㅈ", "ㅊ", "ㅌ", "ㅎ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ"],
    jongsung: ["", "ㄴ", "ㅁ", "ㄹ", "ㅇ"],
    answer: { cho: "ㅅ", jung: "ㅏ", jong: "ㄴ" }
  },
  {
    target: "달",
    meaning: "Moon",
    chosung: ["ㄷ", "ㅌ", "ㄹ", "ㄴ", "ㅁ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅐ"],
    jongsung: ["", "ㄹ", "ㄴ", "ㅁ", "ㅇ"],
    answer: { cho: "ㄷ", jung: "ㅏ", jong: "ㄹ" }
  },
  {
    target: "불",
    meaning: "Fire",
    chosung: ["ㅂ", "ㅍ", "ㅁ", "ㅇ", "ㄴ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ"],
    jongsung: ["", "ㄹ", "ㄴ", "ㅁ", "ㅂ"],
    answer: { cho: "ㅂ", jung: "ㅜ", jong: "ㄹ" }
  },
  {
    target: "눈",
    meaning: "Eye / Snow",
    chosung: ["ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ"],
    jongsung: ["", "ㄴ", "ㅁ", "ㄹ", "ㅇ"],
    answer: { cho: "ㄴ", jung: "ㅜ", jong: "ㄴ" }
  },
  {
    target: "밥",
    meaning: "Rice / Meal",
    chosung: ["ㅂ", "ㅍ", "ㅁ", "ㅅ", "ㅈ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅐ"],
    jongsung: ["", "ㅂ", "ㄴ", "ㅁ", "ㄹ"],
    answer: { cho: "ㅂ", jung: "ㅏ", jong: "ㅂ" }
  },
  {
    target: "책",
    meaning: "Book",
    chosung: ["ㅊ", "ㅈ", "ㅅ", "ㅎ", "ㅋ"],
    jungsung: ["ㅏ", "ㅓ", "ㅐ", "ㅔ", "ㅗ"],
    jongsung: ["", "ㄱ", "ㄴ", "ㅁ", "ㅇ"],
    answer: { cho: "ㅊ", jung: "ㅐ", jong: "ㄱ" }
  },
  {
    target: "집",
    meaning: "House",
    chosung: ["ㅈ", "ㅊ", "ㅅ", "ㅎ", "ㄱ"],
    jungsung: ["ㅏ", "ㅓ", "ㅣ", "ㅔ", "ㅗ"],
    jongsung: ["", "ㅂ", "ㄴ", "ㅁ", "ㄱ"],
    answer: { cho: "ㅈ", jung: "ㅣ", jong: "ㅂ" }
  },
  {
    target: "꽃",
    meaning: "Flower",
    chosung: ["ㄲ", "ㄱ", "ㅋ", "ㅎ", "ㅍ"],
    jungsung: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅣ"],
    jongsung: ["", "ㅊ", "ㅅ", "ㄴ", "ㅁ"],
    answer: { cho: "ㄲ", jung: "ㅗ", jong: "ㅊ" }
  },
];
