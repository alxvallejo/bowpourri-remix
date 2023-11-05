import { PlayerData, Player, Standup } from '../types';

type IProps = {
  standup: Standup;
};

export const StandupList = ({ standup }: IProps) => {
  const { players } = standup;
  return (
    <div className='card border-accent bg-base-200 text-accent'>
      <div className='card-body'>
        <div className='flex flex-col items-start justify-start '>
          <div className='w-100 card-title flex-1 flex-row justify-between'>
            <h2>Standup</h2>
          </div>
          <div className='w-100'>
            <ul>
              {players?.map((player, index) => {
                return (
                  <li key={index}>
                    <div className='flex'>{player.name}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
