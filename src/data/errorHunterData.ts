import type { ErrorHunterQuestion } from '../types/game';

export const errorHunterQuestions: ErrorHunterQuestion[] = [
  {
    sentence: "저는 어제 친구를 만납니다.",
    errorWord: "만납니다",
    correction: "만났어요",
    options: ["만났어요", "만나요", "만납니다"],
    explanation: "과거의 일은 과거형 어미 '-았/었-'을 사용해야 합니다."
  },
  {
    sentence: "나는 학교에서 공부를 하다.",
    errorWord: "하다",
    correction: "해요",
    options: ["해요", "합니다", "하다"],
    explanation: "문장 종결 시 적절한 어미를 사용해야 합니다."
  },
  {
    sentence: "오늘 날씨가 너무 춥습니다.",
    errorWord: "춥습니다",
    correction: "추워요",
    options: ["추워요", "춥습니다", "춥다"],
    explanation: "'춥다'는 'ㅂ' 불규칙 활용을 합니다."
  },
  {
    sentence: "나는 커피가 마시고 싶다.",
    errorWord: "커피가",
    correction: "커피를",
    options: ["커피를", "커피가", "커피이"],
    explanation: "'마시다'의 목적어는 조사 '-를/을'을 사용합니다."
  },
  {
    sentence: "저는 내일 한국을 갑니다.",
    errorWord: "한국을",
    correction: "한국에",
    options: ["한국에", "한국을", "한국으로"],
    explanation: "장소로의 이동은 조사 '-에'를 사용합니다."
  },
  {
    sentence: "친구하고 같이 영화를 봤다.",
    errorWord: "봤다",
    correction: "봤어요",
    options: ["봤어요", "봤다", "보다"],
    explanation: "문장은 적절한 종결어미로 끝나야 합니다."
  },
  {
    sentence: "이 음식은 정말 맛있다!",
    errorWord: "맛있다",
    correction: "맛있어요",
    options: ["맛있어요", "맛있다", "맛있습니다"],
    explanation: "구어체에서는 '-어요/아요' 어미를 사용합니다."
  },
  {
    sentence: "저는 매일 아침를 먹어요.",
    errorWord: "아침를",
    correction: "아침을",
    options: ["아침을", "아침를", "아침이"],
    explanation: "받침이 있는 명사 뒤에는 '-을'을 사용합니다."
  },
  {
    sentence: "선생님이 학생을 가르쳐요.",
    errorWord: "선생님이",
    correction: "선생님께서",
    options: ["선생님께서", "선생님이", "선생님은"],
    explanation: "높임 대상에는 주격 조사 '-께서'를 사용합니다."
  },
  {
    sentence: "저는 서울에서 살다.",
    errorWord: "살다",
    correction: "살아요",
    options: ["살아요", "삽니다", "살다"],
    explanation: "문장 종결 시 적절한 어미를 사용해야 합니다."
  },
  {
    sentence: "어머니께서 요리를 만들어요.",
    errorWord: "만들어요",
    correction: "만드세요",
    options: ["만드세요", "만들어요", "만들다"],
    explanation: "높임 주체에는 높임법 '-시-'를 사용해야 합니다."
  },
  {
    sentence: "저는 책이 읽고 싶어요.",
    errorWord: "책이",
    correction: "책을",
    options: ["책을", "책이", "책가"],
    explanation: "'읽다'의 목적어는 조사 '-을/를'을 사용합니다."
  },
  {
    sentence: "오늘은 비가 옵니다.",
    errorWord: "옵니다",
    correction: "와요",
    options: ["와요", "옵니다", "오다"],
    explanation: "'오다'는 '와요'로 활용합니다."
  },
  {
    sentence: "내일 친구를 만나다.",
    errorWord: "만나다",
    correction: "만날 거예요",
    options: ["만날 거예요", "만나다", "만났어요"],
    explanation: "미래의 일은 '-ㄹ 거예요' 형태를 사용합니다."
  },
  {
    sentence: "저는 매일 운동를 해요.",
    errorWord: "운동를",
    correction: "운동을",
    options: ["운동을", "운동를", "운동이"],
    explanation: "받침이 있는 명사 '운동' 뒤에는 '-을'을 사용합니다."
  },
];
