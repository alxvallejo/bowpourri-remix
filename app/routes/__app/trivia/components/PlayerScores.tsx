import {
  CheckIcon,
  CheckBadgeIcon,
  FaceFrownIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

const tableCellBg = 'bg-base-100';
const tableContentColor = 'text-neutral-content';

const PlayerScoreRow = ({ player, rank }) => {
  const { score, name } = player;
  return (
    <tr>
      <td className={tableCellBg}>{rank}</td>
      <td className={tableCellBg}>{name}</td>
      <td className={tableCellBg}>{score || 0}</td>
    </tr>
  );
};

export const PlayerScores = ({ playerStats }) => {
  if (!playerStats) {
    return <div>No player scores yet!</div>;
  }
  const scores = playerStats.sort((a, b) => {
    return b.score - a.score;
  });
  return (
    <div className='card md:w-96'>
      <table className={`table-compact table w-full ${tableContentColor}`}>
        <thead>
          <tr>
            <th className={tableCellBg}></th>
            <th className={tableCellBg}>Name</th>
            <th className={tableCellBg}>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((player, index) => {
            return (
              <PlayerScoreRow key={index} player={player} rank={index + 1} />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const PlayerStatus = ({ player, standup, correctAnswer }) => {
  const { name, answered, isCorrect } = player;
  let border = 'flex px-2 py-1';
  if (standup?.nextSpinner?.email === player?.email) {
    border += ' border-2 rounded-lg border-primary';
  }
  let answerIcon;
  if (correctAnswer) {
    if (isCorrect == true) {
      answerIcon = <CheckBadgeIcon className='h-6 w-6 text-green-500' />;
    } else if (isCorrect == false) {
      answerIcon = <FaceFrownIcon className='text-warning-500 h-6 w-6' />;
    }
  } else if (answered) {
    answerIcon = <CheckIcon className='h-6 w-6 text-green-500' />;
  }
  return (
    <div className='flex'>
      <div className={border}>
        {name} {answerIcon}
      </div>
    </div>
  );
};

export const PlayerTableCard = ({
  players,
  setShowOptions,
  standup,
  correctAnswer,
}) => {
  if (!players) {
    console.log('no players', players);
    return <div></div>;
  }
  return (
    <div className='card border-accent bg-base-200 text-accent mb-3'>
      <div className='card-body'>
        <div className='flex items-start justify-start'>
          <div className='w-100 card-title flex-1 flex-row justify-between'>
            <h2>Players</h2>
            <button
              className='btn-sm btn-square btn'
              onClick={() => setShowOptions(true)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4.867 19.125h.008v.008h-.008v-.008z'
                />
              </svg>
            </button>
          </div>
        </div>
        <ul>
          {players?.map((player, index) => {
            return (
              <li key={index}>
                <PlayerStatus
                  player={player}
                  standup={standup}
                  correctAnswer={correctAnswer}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
