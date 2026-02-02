import type { GrammarTrainQuestion } from '../types/game';

export const grammarTrainQuestions: GrammarTrainQuestion[] = [
  {
    stem: "밥을 먹",
    context: "친구를 만났어요.",
    answer: "-고",
    options: ["-지만", "-고", "-아서", "-니까"],
    fullSentence: "밥을 먹고 친구를 만났어요."
  },
  {
    stem: "학교",
    context: "갑니다.",
    answer: "에",
    options: ["가", "를", "에", "에서"],
    fullSentence: "학교에 갑니다."
  },
  {
    stem: "날씨가 좋",
    context: "공원에 갔어요.",
    answer: "-아서",
    options: ["-고", "-지만", "-아서", "-으면"],
    fullSentence: "날씨가 좋아서 공원에 갔어요."
  },
  {
    stem: "피곤하",
    context: "일찍 잤어요.",
    answer: "-아서",
    options: ["-고", "-지만", "-아서", "-으니까"],
    fullSentence: "피곤해서 일찍 잤어요."
  },
  {
    stem: "비가 오",
    context: "우산을 가져가세요.",
    answer: "-니까",
    options: ["-고", "-지만", "-아서", "-니까"],
    fullSentence: "비가 오니까 우산을 가져가세요."
  },
  {
    stem: "영화",
    context: "봤어요.",
    answer: "를",
    options: ["가", "를", "에", "에서"],
    fullSentence: "영화를 봤어요."
  },
  {
    stem: "공부하",
    context: "친구를 만났어요.",
    answer: "-고",
    options: ["-고", "-지만", "-아서", "-니까"],
    fullSentence: "공부하고 친구를 만났어요."
  },
  {
    stem: "맛있",
    context: "많이 먹었어요.",
    answer: "-어서",
    options: ["-고", "-지만", "-어서", "-으면"],
    fullSentence: "맛있어서 많이 먹었어요."
  },
  {
    stem: "시간이 없",
    context: "택시를 탔어요.",
    answer: "-어서",
    options: ["-고", "-지만", "-어서", "-으면"],
    fullSentence: "시간이 없어서 택시를 탔어요."
  },
  {
    stem: "한국어",
    context: "배워요.",
    answer: "를",
    options: ["가", "를", "에", "로"],
    fullSentence: "한국어를 배워요."
  },
  {
    stem: "듣",
    context: "따라 말해요.",
    answer: "-고",
    options: ["-고", "-지만", "-아서", "-으면"],
    fullSentence: "듣고 따라 말해요."
  },
  {
    stem: "바쁘",
    context: "못 갔어요.",
    answer: "-아서",
    options: ["-고", "-지만", "-아서", "-으면"],
    fullSentence: "바빠서 못 갔어요."
  },
  {
    stem: "도서관",
    context: "공부해요.",
    answer: "에서",
    options: ["가", "를", "에", "에서"],
    fullSentence: "도서관에서 공부해요."
  },
  {
    stem: "집에 가",
    context: "쉬세요.",
    answer: "-서",
    options: ["-고", "-지만", "-서", "-면"],
    fullSentence: "집에 가서 쉬세요."
  },
  {
    stem: "친구",
    context: "같이 갔어요.",
    answer: "와",
    options: ["가", "를", "와", "에서"],
    fullSentence: "친구와 같이 갔어요."
  },
];
