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
  nextSpinner: Player;
  nextWinnerEmail: String | null;
  players: Player[];
}
