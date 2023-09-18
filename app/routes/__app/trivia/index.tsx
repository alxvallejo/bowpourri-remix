import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { useUser } from '~/utils';
import Countdown from 'react-countdown';
import {
  CheckIcon,
  CheckBadgeIcon,
  FaceFrownIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { categories } from './categories';
import { CategoryForm } from './CategoryForm';
import { SelectCategoryCard, ShowQuestion } from './components/Categories';
import { OptionsModal } from './components/Options';
import { useAnimationFrame } from 'framer-motion';
import TailwindColor from '../../../tailwindColor';
// import daisyThemes from 'daisyui/src/colors/themes';
import { SpinWheel } from './spinWheel.client';
import { ClientOnly } from 'remix-utils';

import {
  PlayerScores,
  PlayerTableCard,
  PlayerStatus,
} from './components/PlayerScores';

// console.log('daisyThemes: ', daisyThemes);

const ANSWER_BUFFER = 5;

const tableCellBg = 'bg-base-100';
const tableContentColor = 'text-neutral-content';

const tailwindColor = new TailwindColor(null);

type PlayerData = {
  socketId: String;
  name: String;
  email: String;
  answered: Boolean;
};

interface StandUp {
  isBowpourri: boolean;
  doneList: PlayerData[];
}

const defaultStandup = {
  isBowpourri: false,
  doneList: [],
};

export default function TriviaIndex() {
  const user = useUser();
  // console.log('user: ', user);
  const [showSpinWheel, setShowSpinWheel] = useState(true);
  const [userData, setUserData] = useState();
  const [signedIn, setSignedIn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  // const [categorySelector, setCategorySelector] = useState();
  const [userCategories, setUserCategories] = useState([]);
  const [yesterdaysWinner, setYesterdaysWinner] = useState();
  const [newGame, setNewGame] = useState();
  const [newGameError, setNewGameError] = useState();
  const [playerScores, setPlayerScores] = useState();
  const [playerScoreError, setPlayerScoreError] = useState();
  const [showPlayerScores, setShowPlayerScores] = useState(false);
  const [showBowpourriStart, setShowBowpourriStart] = useState(false);
  const [playerStats, setPlayerStats] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState();
  const [minPlayers, setMinPlayers] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [optionMinPlayers, setOptionMinPlayers] = useState();
  const [answerContext, setAnswerContext] = useState();
  const [countdownSeconds, setCountdownSeconds] = useState(15);
  const [standup, setStandup] = useState<Standup>(defaultStandup);
  const [answerImg, setAnswerImg] = useState();

  const { socket, currentTheme } = useOutletContext();

  const onSignOut = (socketId) => {
    // Remove the corresponding player
    const newPlayers = players.filter((x) => x.socketId !== socketId);
    setPlayers(newPlayers);
  };

  const handlePlayerScores = (newPlayerScores) => {
    console.log('newPlayerScores: ', newPlayerScores);
    setPlayerScores(newPlayerScores);
    setShowPlayerScores(true);
    setGameComplete(true);

    setStandup({
      ...standup,
      isBowpourri: false,
      isComplete: standup.players.length > 0,
    });

    // Spin the wheel after game is finished
    socket.emit('handleSpin');
  };

  // Inbound
  const handleRefreshWheel = (players, selectedSpinner) => {
    console.log('selectedSpinner: ', selectedSpinner);

    let newStandup = {
      players,
      nextSpinner: selectedSpinner,
      nextWinnerEmail: null,
      isComplete: players.length === 0,
      isBowpourri: false,
      categorySelector: undefined,
    };
    setStandup(newStandup);
  };

  const handleSpinResults = (
    nextWinnerEmail: string,
    nextPlayers: PlayerData[]
  ) => {
    console.log('MSG: Handling spin results');
    const isBowpourri = nextWinnerEmail === 'bowpourri';
    const previousSpinner = standup.nextSpinner;
    // const nextWinnerIndex = isBowpourri
    //   ? null
    //   : nextPlayers.findIndex((x) => x.email === nextWinnerEmail);
    const nextSpinner = isBowpourri
      ? null
      : nextPlayers.find((x) => x.email === nextWinnerEmail);
    console.log('nextSpinner: ', nextSpinner);
    console.log('players: ', players);
    console.log('nextPlayers: ', nextPlayers);
    console.log('nextWinnerEmail: ', nextWinnerEmail);
    setStandup({
      ...standup,
      players: nextPlayers,
      nextWinnerEmail,
      // nextWinnerIndex,
      nextSpinner,
      isBowpourri: nextWinnerEmail === 'bowpourri',
      categorySelector: isBowpourri ? previousSpinner?.email : null,
    });
    if (isBowpourri) {
      console.log('setting isBowpourri to true');
      setShowBowpourriStart(true);
    }
  };

  const BowpourriStartModal = () => {
    const handleOk = () => {
      setShowBowpourriStart(false);
      setShowSpinWheel(false);
    };
    return (
      <div className={bowpourriStartModalClass}>
        <div className='modal-box relative'>
          <label
            className='btn-sm btn-circle btn absolute right-2 top-2'
            onClick={() => setShowBowpourriStart(false)}
          >
            ✕
          </label>
          <h3 className='text-lg font-bold'>Bowpourri!</h3>
          <div className='p-5'></div>
          <div className='mt-5'>
            <div className='btn-accent btn' onClick={handleOk}>
              Ok
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePlayAgain = () => {
    setSignedIn(false);
    setGameComplete(false);
    setSelectedCategory();
    setNewGame();
    setNewGameError();
    setPlayers([]);
    setPlayerScores();
    setPlayerScoreError();
    setSelectedOption();
    setCountdownCompleted(false);
    setCorrectAnswer();
    setAnswerImg();
  };

  const handleResetGame = (msg) => {
    console.log('msg: ', msg);
    handlePlayAgain();
  };

  const handleCategory = (name, newCategory) => {
    console.log('newCategory: ', newCategory);
    // setCategorySelector(name);
    setSelectedCategory(newCategory);
  };

  const handleUserScores = (userScores) => {
    console.log('userScores: ', userScores);
    setPlayerScores(userScores);
  };

  const handlePlayerStats = async (stats, gameFinished: boolean = false) => {
    setPlayerStats(stats);
    if (gameFinished) {
      setShowPlayerScores(true);
      setGameComplete(true);
    }
  };

  const handleUserCategories = (cats) => {
    const groups = cats.reduce((groups, item) => {
      const group = groups[item.created_by] || [];
      group.push(item);
      groups[item.created_by] = group;
      return groups;
    }, {});
    setUserCategories(groups);
    console.log('groups: ', groups);
  };

  useEffect(() => {
    if (!playerStats) {
      socket.emit('playerStats');
    }
  }, [playerStats]);

  const handleNewGame = (newGame) => {
    console.log('newGame: ', newGame);
    setSelectedCategory(newGame.category);
    setNewGame(newGame);
  };

  const handleGameRules = (rules) => {
    console.log('rules: ', rules);
    if (rules) {
      setMinPlayers(rules?.min_players);
      setOptionMinPlayers(rules?.min_players);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('message', (msg) => {
      console.log('msg: ', msg);
    });
    socket.on('userScores', handleUserScores);
    socket.on('players', setPlayers);
    socket.on('category', handleCategory);
    socket.on('newGame', handleNewGame);
    socket.on('newGameError', setNewGameError);
    socket.on('playerScores', handlePlayerScores);
    socket.on('playerScoreError', setPlayerScoreError);
    socket.on('playerStats', handlePlayerStats);
    socket.on('answer', setCorrectAnswer);
    socket.on('signOut', onSignOut);
    socket.on('resetGame', handleResetGame);
    socket.on('userCategories', handleUserCategories);
    socket.on('gameRules', handleGameRules);
    socket.on('answerContext', setAnswerContext);
    socket.on('refreshWheel', handleRefreshWheel);
    socket.on('spinResults', handleSpinResults);
    socket.on('answerImg', setAnswerImg);
  }, [socket]);

  useEffect(() => {
    return () => {
      console.log('Disconnect on tab close');
      // Remove yourself from players list
      console.log('userData on disconnect: ', userData);
      socket.emit('signOut', userData?.email);
      socket.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log('user: ', user);
      setUserData({
        email: user.email,
        name: user.name,
        id: user.id,
      });
    }
  }, [user]);

  useEffect(() => {
    console.log('players: ', players);
    if (players && players.find((x) => x.email == user.email)) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [players]);

  useEffect(() => {
    if (selectedOption && userData) {
      socket.emit('answer', userData.email, selectedOption);
    }
  }, [selectedOption, userData]);

  const handleSignIn = () => {
    if (userData) {
      console.log('userData: ', userData);
      socket.emit('signIn', userData);
    }
  };

  const SignInCard = () => {
    return (
      <div className='card prose md:w-96'>
        <h1>Bowpourri</h1>
        <button onClick={handleSignIn} className='btn-primary btn'>
          Join Standup
        </button>
      </div>
    );
  };

  const displayAnswer = () => {
    if (!correctAnswer) {
      return <div />;
    }
    const showImg = () => {
      if (answerImg) {
        const { image, keywords } = answerImg;
        return (
          <figure className='max-w-lg m-6'>
            <img
              className='h-auto max-w-full'
              src={image.original}
              alt={keywords}
            />
            <figcaption className='mt-2 text-sm text-center text-gray-500 dark:text-gray-400'>
              {keywords}
            </figcaption>
          </figure>
        );
      }
      return <div />;
    };
    const isCorrect = correctAnswer.option == selectedOption;
    if (isCorrect) {
      return (
        <div className='prose lg:prose-md mb-6'>
          <h2 className='text-success'>Congratulations!</h2>
          <div>Correct Answer: {correctAnswer.option}</div>
          <div className='text-lg'>{answerContext}</div>
          {showImg()}
          <BowpourriStartModal />
        </div>
      );
    } else {
      return (
        <div className='prose lg:prose-md mb-6'>
          <h3 className='text-info'>Sorry, you are incorrect.</h3>
          <div>Correct Answer: {correctAnswer.option}</div>
          <div className='text-lg'>{answerContext}</div>
          {showImg()}
          <BowpourriStartModal />
        </div>
      );
    }
  };

  const handleAnswer = ({ seconds, completed }) => {
    if (correctAnswer) {
      displayAnswer();
    } else {
      return <div>Letting you change your mind for {seconds} seconds...</div>;
    }
  };

  const ShowAnswer = () => {
    if (newGame) {
      const ms = ANSWER_BUFFER * 1000;
      return (
        <div>
          <Countdown date={Date.now() + ms} renderer={handleAnswer} />
        </div>
      );
    } else {
      return <div />;
    }
  };

  const unanswered = players.filter((x) => !x.answered);

  const NewGameButton = () => {
    if (!gameComplete && signedIn && selectedCategory) {
      return (
        <button
          className='btn-primary btn'
          onClick={() => {
            setNewGame(null);
            if (selectedCategory) {
              socket.emit('refreshGame', name, selectedCategory);
            }
          }}
        >
          New Game
        </button>
      );
    }
    return <div />;
  };

  const GameActions = () => {
    const name = userData?.name || userData?.email;
    return (
      <div className='card mt-4 w-full bg-neutral md:basis-1/4'>
        {/* <button className="btn-secondary btn" onClick={handleSignOut}>
          Sign Out
        </button> */}

        {gameComplete && (
          <button className='btn-primary btn' onClick={handlePlayAgain}>
            Play Again
          </button>
        )}

        <NewGameButton />
      </div>
    );
  };

  const selectCategory = () => {
    return (
      <SelectCategoryCard
        standup={standup}
        selectedCategory={selectedCategory}
        categories={categories}
        players={players}
        minPlayers={minPlayers}
        userCategories={userCategories}
        userData={userData}
        socket={socket}
      />
    );
  };

  const PlayerSpinWheel = () => {
    const [winningPlayer, setWinningPlayer] = useState<PlayerData>();

    if (!players || players.length < 1) {
      return <div />;
    }

    const onStopSpin = (player: PlayerData) => {
      setWinningPlayer(player);
    };

    const handleSpin = () => {
      socket.emit('handleSpin');
    };

    if (!standup) {
      return <div>Waiting for more players</div>;
    }

    const { nextSpinner, nextWinnerEmail, isComplete } = standup;
    console.log('nextSpinner: ', nextSpinner);

    const isPlayer = nextSpinner?.email === user.email;

    return (
      <div className='container mx-auto'>
        <div className='flex flex-wrap flex-col justify-between'>
          {isPlayer ? (
            selectCategory()
          ) : (
            <div className=''>{nextSpinner?.name}, You're up!</div>
          )}
          {selectedCategory ? (
            <ShowQuestion
              newGame={newGame}
              signedIn={signedIn}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          ) : (
            ''
          )}
          {newGame && unanswered.length > 0 ? (
            <div>Waiting on: {unanswered.map((p, i) => p.name).join(', ')}</div>
          ) : (
            <ShowAnswer />
          )}

          {/* <ClientOnly fallback={<div />}>
            {() => (
              <SpinWheel
                userData={userData}
                standup={standup}
                themeColors={themeColors}
                handleSpin={handleSpin}
                onStopSpin={onStopSpin}
              />
            )}
          </ClientOnly> */}

          {/* <div className='relative prose lg:prose-xl text-success'>
            <h1>{winningPlayer?.name}</h1>
          </div> */}
        </div>
      </div>
    );
  };

  const handleSaveCategory = async (category) => {
    if (!userData?.name) {
      console.log('no userData', userData);
    }
    // return;
    socket.emit('addCategory', category, userData?.name);
  };

  const editOptions = () => {
    if (optionMinPlayers && optionMinPlayers > 0) {
      socket.emit('editMinPlayers', optionMinPlayers);
    }
  };

  const handleMinPlayerOptionUpdate = (e) => {
    const newVal = e.target.value;
    setOptionMinPlayers(newVal);
  };

  const playerScoreModalClass = showPlayerScores ? 'modal modal-open' : 'modal';
  const optionsModalClass = showOptions ? 'modal modal-open' : 'modal';
  const bowpourriStartModalClass = showBowpourriStart
    ? 'modal modal-open'
    : 'modal';

  const yourCategories = userCategories?.[userData?.name];

  console.log('showSpinWheel: ', showSpinWheel);

  const optionsModal = () => {
    return (
      <OptionsModal
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        minPlayers={minPlayers}
        optionMinPlayers={optionMinPlayers}
        editOptions={editOptions}
        handleMinPlayerOptionUpdate={handleMinPlayerOptionUpdate}
      />
    );
  };

  const playerTableCard = () => {
    return (
      <PlayerTableCard
        players={players}
        setShowOptions={setShowOptions}
        standup={standup}
        correctAnswer={correctAnswer}
      />
    );
  };

  if (showSpinWheel) {
    console.log('signedIn: ', signedIn);
    if (!signedIn) {
      return (
        <div className='container mx-auto'>
          <div className='flex flex-wrap justify-between'>
            <div className='basis-3/4 pr-6'>
              <div className='flex justify-center content-center h-screen'>
                <button onClick={handleSignIn} className='btn-primary btn'>
                  Sign in to Bowst
                </button>
              </div>
            </div>
            <div className='basis-1/4'>{playerTableCard()}</div>
          </div>
        </div>
      );
    }
    if (!minPlayers) {
      return <div>Set min players!</div>;
    }
    if (players.length < minPlayers) {
      return (
        <div className='container mx-auto'>
          <div className='flex flex-wrap justify-between'>
            <div className='basis-3/4 pr-6'>
              <div className='prose'>
                <h2>Waiting for more players...</h2>
              </div>
            </div>
            <div className='basis-1/4'>{playerTableCard()}</div>
          </div>
          {optionsModal()}
        </div>
      );
    }
    console.log('showSpinWheel: ', showSpinWheel);
    return (
      <div className='container mx-auto'>
        <div className='flex flex-wrap justify-between'>
          <div className='basis-3/4 pr-6'>
            <PlayerSpinWheel />
          </div>
          <div className='basis-1/4'>{playerTableCard()}</div>
        </div>
        <div className={playerScoreModalClass}>
          <div className='modal-box relative'>
            <label
              className='btn-sm btn-circle btn absolute right-2 top-2'
              onClick={() => setShowPlayerScores(false)}
            >
              ✕
            </label>
            {correctAnswer && displayAnswer()}

            {/* <h3 className='text-lg font-bold'>Winner's Circle</h3> */}
            {/* <PlayerScores /> */}
            <NewGameButton />
          </div>
        </div>
        {optionsModal()}
        <div className='btm-nav btm-nav-lg h-auto p-5 invisible md:visible'>
          <div>
            {!newGame && (
              <CategoryForm handleSaveCategory={handleSaveCategory} />
            )}
          </div>
          <div>
            <h2>Your Categories</h2>
            {yourCategories?.map((yourCategory, i) => {
              return (
                <button
                  key={i}
                  className='btn-sm btn gap-2'
                  onClick={() => socket.emit('deleteCategory', yourCategory.id)}
                >
                  {yourCategory.name}
                  <XMarkIcon className='h-6 w-6 text-slate-500' />
                </button>
              );
            })}
          </div>
          <div className='p-1'>
            <PlayerScores playerStats={playerStats} />
          </div>
        </div>
      </div>
    );
  }
}
