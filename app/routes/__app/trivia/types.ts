export type SignInData = {
  email: string;
  id: string;
  name: string;
};

export type PlayerData = {
  created_at: String;
  email: String;
  id: String;
  name: String;
  score: Number;
};

export type Player = {
  socketId: String;
  name: String;
  email: String;
  answered: Boolean;
  playerData: PlayerData;
};

export interface Standup {
  categorySelector: Player | undefined | SignInData;
  isBowpourri: boolean;
  isComplete: boolean;
  nextSpinner: Player | undefined;
  nextWinnerEmail: String | null;
  players: Player[];
}

export type AnimationSequenceItem = {
  key: string;
  complete: boolean;
};

export type AnimationSequence = AnimationSequenceItem[];

export type TypeWriteSequenceProps = {
  text: string;
  name: string;
  animationSequence: AnimationSequence;
  onComplete: (index: number) => void;
  index: number;
};

export type PlayerAnswer = {
  email: string;
  answer: string;
};

export type Option = {
  isAnswer: boolean;
  option: string;
};

export type GamePublic = {
  category: string;
  gameId: number;
  options: Option[];
  question: string;
};

export type Game = {
  category: string;
  gameId: number;
  options: Option[];
  question: string;
  correctAnswer: Option;
  answerContext: string;
  keywords: string;
};

export type GameRules = {
  answer_buffer: number;
  countdown_seconds: number;
  created_at: string;
  id: number;
  min_players: number;
};

export type UserCategory = {
  created_at: string;
  created_by: string;
  id: number;
  name: string;
};

export type UserCategories = {
  [name: string]: UserCategory[];
};

export type PlayerStat = {
  created_at: string;
  email: string;
  id: string;
  name: string;
  score: number;
};
