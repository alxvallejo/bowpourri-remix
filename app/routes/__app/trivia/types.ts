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
  categorySelector: Player | undefined;
  isBowpourri: boolean;
  isComplete: boolean;
  nextSpinner: Player | undefined;
  nextWinnerEmail: String | null;
  players: Player[];
}

export type AnimationsComplete = {
  question: boolean;
  opt1: boolean;
  opt2: boolean;
  opt3: boolean;
  opt4: boolean;
};

export type AnimationAnswer = {
  header: boolean;
  answer: boolean;
  context: boolean;
  action: boolean;
};
