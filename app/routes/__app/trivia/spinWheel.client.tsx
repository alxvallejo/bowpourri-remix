import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';

export const SpinWheel = ({
  userData,
  standup,
  themeColors,
  handleSpin,
  onStopSpin,
}) => {
  const [nextWinnerIndex, setNextWinnerIndex] = useState();
  const { players, nextSpinner, nextWinnerEmail, isComplete } = standup;

  let testOptions = ['Mark', 'Bill', 'Ted', 'Neo', 'Jack', 'Alex'].map((p) => {
    return { option: p };
  });

  useEffect(() => {
    if (standup) {
      console.log('standup: ', standup);
      console.log('nextWinnerEmail: ', nextWinnerEmail);

      const winnerIndex = nextWinnerEmail
        ? players.findIndex((x) => x.email == nextWinnerEmail)
        : 0; // defaults to Bowpourri option
      if (winnerIndex !== -1) {
        setNextWinnerIndex(winnerIndex);
        console.log('winnerIndex: ', winnerIndex);
      }
    }

    return () => {};
  }, [standup]);

  if (!standup || players?.length === 0) {
    // console.log('nextSpinner: ', nextSpinner);
    return <div>Starting Standup</div>;
  }

  const playerOptions = standup?.players?.map((p) => {
    return {
      option: p.name,
    };
  });

  const handleStopSpin = () => {
    if (typeof nextWinnerIndex === 'number') {
      onStopSpin(players[nextWinnerIndex]);
    }
  };

  const isSpinner = userData.email === standup?.nextSpinner?.email;

  const startSpin = nextWinnerIndex || nextWinnerIndex === 0 ? true : false;
  console.log('startSpin: ', startSpin);

  return (
    <div>
      <Wheel
        mustStartSpinning={startSpin}
        prizeNumber={nextWinnerIndex || 0}
        data={playerOptions}
        backgroundColors={themeColors}
        textColors={['#ffffff']}
        onStopSpinning={handleStopSpin}
        spinDuration={0.2}
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
