import type { StoryScene } from '../types/game';

export const storyScenes: StoryScene[] = [
  {
    id: 1,
    title: "카페에서",
    background: "cafe",
    dialogues: [
      { speaker: "staff", text: "안녕하세요! 주문하시겠어요?" },
      { speaker: "user", text: "아이스 아메리카노 _______.", blank: true }
    ],
    answer: "주세요",
    options: ["주세요", "가세요", "오세요"],
    newVocab: "주세요"
  },
  {
    id: 2,
    title: "음식점에서",
    background: "restaurant",
    dialogues: [
      { speaker: "staff", text: "어서 오세요. 몇 분이세요?" },
      { speaker: "user", text: "두 _______ 왔어요.", blank: true }
    ],
    answer: "명이",
    options: ["명이", "개가", "사람이"],
    newVocab: "명"
  },
  {
    id: 3,
    title: "지하철에서",
    background: "subway",
    dialogues: [
      { speaker: "other", text: "실례합니다. 이 자리 _______?" },
      { speaker: "user", text: "네, 앉으세요.", blank: false }
    ],
    answer: "비었어요",
    options: ["비었어요", "있어요", "앉아요"],
    newVocab: "비다"
  },
  {
    id: 4,
    title: "쇼핑할 때",
    background: "shop",
    dialogues: [
      { speaker: "staff", text: "이 옷 어떠세요?" },
      { speaker: "user", text: "좀 더 _______ 거 있어요?", blank: true }
    ],
    answer: "작은",
    options: ["작은", "작다", "작게"],
    newVocab: "작은"
  },
  {
    id: 5,
    title: "길 묻기",
    background: "street",
    dialogues: [
      { speaker: "user", text: "저기요, 지하철역이 어디에 _______?" },
      { speaker: "other", text: "저기 편의점 옆에 있어요.", blank: false }
    ],
    answer: "있어요",
    options: ["있어요", "가요", "와요"],
    newVocab: "있다"
  },
  {
    id: 6,
    title: "전화 통화",
    background: "phone",
    dialogues: [
      { speaker: "other", text: "여보세요, 김민수 씨 계세요?" },
      { speaker: "user", text: "잠깐만 _______.", blank: true }
    ],
    answer: "기다리세요",
    options: ["기다리세요", "가세요", "오세요"],
    newVocab: "기다리다"
  },
  {
    id: 7,
    title: "약속 잡기",
    background: "calendar",
    dialogues: [
      { speaker: "other", text: "이번 주말에 뭐 해요?" },
      { speaker: "user", text: "약속이 _______.", blank: true }
    ],
    answer: "없어요",
    options: ["없어요", "있어요", "해요"],
    newVocab: "약속"
  },
  {
    id: 8,
    title: "병원에서",
    background: "hospital",
    dialogues: [
      { speaker: "staff", text: "어디가 아프세요?" },
      { speaker: "user", text: "머리가 _______.", blank: true }
    ],
    answer: "아파요",
    options: ["아파요", "있어요", "해요"],
    newVocab: "아프다"
  },
  {
    id: 9,
    title: "택시에서",
    background: "taxi",
    dialogues: [
      { speaker: "user", text: "강남역으로 _______." },
      { speaker: "staff", text: "네, 알겠습니다.", blank: false }
    ],
    answer: "가 주세요",
    options: ["가 주세요", "갑니다", "가세요"],
    newVocab: "-아/어 주세요"
  },
  {
    id: 10,
    title: "호텔에서",
    background: "hotel",
    dialogues: [
      { speaker: "user", text: "체크인 _______." },
      { speaker: "staff", text: "네, 예약하셨어요?", blank: false }
    ],
    answer: "하고 싶어요",
    options: ["하고 싶어요", "합니다", "해요"],
    newVocab: "-고 싶다"
  },
];
