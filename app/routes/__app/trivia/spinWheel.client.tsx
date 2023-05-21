import { Wheel } from 'react-custom-roulette';

export const SpinWheel = ({
  userData,
  standup,
  themeColors,
  handleSpin,
  onStopSpin,
}) => {
  let testOptions = ['Mark', 'Bill', 'Ted', 'Neo', 'Jack', 'Alex'].map((p) => {
    return { option: p };
  });
  if (!standup) {
    return <div>Starting Standup</div>;
  }
  const { players, nextSpinner, nextWinner, isComplete } = standup;
  if (!nextSpinner || players.length === 0) {
    return <div>Starting Standup</div>;
  }
  console.log('standup: ', standup);
  const isSpinner = userData.email === nextSpinner.email;
  const nextWinnerIndex = nextWinner
    ? players.findIndex((x) => x.email == nextWinner.email)
    : 0;
  const playerOptions = players.map((p) => {
    return {
      option: p.name,
    };
  });
  return (
    <div>
      <Wheel
        mustStartSpinning={!!nextWinner}
        prizeNumber={nextWinnerIndex}
        data={playerOptions}
        backgroundColors={themeColors}
        textColors={['#ffffff']}
        onStopSpinning={onStopSpin}
      />
      <button
        className='btn-primary btn'
        disabled={!isSpinner}
        onClick={handleSpin}
      >
        Spin
      </button>
    </div>
  );
};
