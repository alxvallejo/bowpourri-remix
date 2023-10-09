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
