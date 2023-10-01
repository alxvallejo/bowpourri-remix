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
import { StandupList } from './components/Standup';
import { categories } from './categories';
import { CategoryForm } from './CategoryForm';
import { SelectCategoryCard, ShowQuestion } from './components/Categories';
import { DisplayAnswer } from './components/Answer';
import { OptionsModal } from './components/Options';
import { useAnimationFrame } from 'framer-motion';
import TailwindColor from '../../../tailwindColor';
// import daisyThemes from 'daisyui/src/colors/themes';
import { SpinWheel } from './spinWheel.client';
import { ClientOnly } from 'remix-utils';
import {
  PlayerData,
  Player,
  Standup,
  AnimationsComplete,
  AnimationAnswer,
} from './types';

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

const defaultStandup = {
  // players:
  isBowpourri: false,
};

const defaultAnimationState: AnimationsComplete = {
  question: false,
  opt1: false,
  opt2: false,
  opt3: false,
  opt4: false,
};

const defaultAnswerAnimationState: AnimationAnswer = {
  header: false,
  answer: false,
  context: false,
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
  const [animationState, setAnimationState] = useState<AnimationsComplete>(
    defaultAnimationState
  );
  const [answerAnimationState, setAnswerAnimationState] =
    useState<AnimationAnswer>(defaultAnswerAnimationState);

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
    console.log('handleRefreshWheel: ', players);

    let newStandup = {
      players,
      nextSpinner: selectedSpinner,
      nextWinnerEmail: null,
      isComplete: players.length === 0,
      isBowpourri: false,
      categorySelector: selectedSpinner,
    };
    setStandup(newStandup);
  };

  const handleSpinResults = (
    nextWinnerEmail: string,
    nextPlayers: Player[],
    currentSpinner: string
  ) => {
    console.log('currentSpinner: ', currentSpinner);

    if (players.length === 0) {
      console.log('NO PLAYERS: ', players);
      // debugger;
    }
    const isBowpourri = nextWinnerEmail === 'bowpourri';
    const categorySelector = currentSpinner
      ? players.find((x) => x.email === currentSpinner)
      : userData;

    console.log('categorySelector: ', categorySelector);
    const nextSpinner = isBowpourri
      ? undefined
      : nextPlayers.find((x) => x.email === nextWinnerEmail);
    console.log('nextSpinner: ', nextSpinner);

    console.log('nextPlayers: ', nextPlayers);
    console.log('nextWinnerEmail: ', nextWinnerEmail);
    setStandup({
      ...standup,
      players: nextPlayers,
      nextWinnerEmail,
      // nextWinnerIndex,
      nextSpinner,
      isBowpourri: nextWinnerEmail === 'bowpourri',
      categorySelector,
    });
    // if (isBowpourri) {
    //   console.log('setting isBowpourri to true');
    //   setShowBowpourriStart(true);
    // }
    console.log('setting isBowpourri to true');
    setShowBowpourriStart(true);
  };

  const handlePlayAgain = () => {
    // Reset player answered boolean
    const newPlayers = players.map((p) =>
      Object.assign({}, p, { answered: false })
    );
    console.log('newPlayers: ', newPlayers);
    // Close player score modal
    setShowPlayerScores(false);
    // setSignedIn(false);
    setGameComplete(false);
    setSelectedCategory();
    setNewGame();
    setNewGameError();
    setPlayers(newPlayers);
    setPlayerScores();
    setPlayerScoreError();
    setSelectedOption();
    setCountdownCompleted(false);
    setCorrectAnswer();
    setAnswerImg();

    // Refresh animation state
    console.log('refreshing animation state');
    debugger;
    setAnimationState(defaultAnimationState);
    setAnswerAnimationState(defaultAnswerAnimationState);
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

  const handleSetPlayers = (newPlayers) => {
    console.log('handling NEW PLAYERS: ', newPlayers);
    setPlayers(newPlayers);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('message', (msg) => {
      console.log('msg: ', msg);
    });
    socket.on('userScores', handleUserScores);
    socket.on('players', handleSetPlayers);
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
      console.log('setting UserData: ', user);
      // const { email, name, id } = user
      setUserData({
        email: user.email,
        name: user.name,
        id: user.id,
      });
    }
  }, [user]);

  useEffect(() => {
    if (players.length > 0) {
      console.log('players NOT EMPTY: ', players);
    }
    console.log('updating PLAYERS: ', players);
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
      console.log('userData on SIGN IN: ', userData);
      socket.emit('signIn', userData);
    }
  };

  const handleAnswer = () => {
    if (correctAnswer) {
      return (
        <DisplayAnswer
          correctAnswer={correctAnswer}
          answerImg={answerImg}
          selectedOption={selectedOption}
          answerContext={answerContext}
          standup={standup}
          handlePlayAgain={handlePlayAgain}
          answerAnimationState={answerAnimationState}
          setAnswerAnimationState={setAnswerAnimationState}
        />
      );
    } else {
      return <div>Letting you change your mind for {seconds} seconds...</div>;
    }
  };

  const ShowAnswer = () => {
    if (newGame) {
      if (unanswered.length > 0) {
        return (
          <div>Waiting on: {unanswered.map((p, i) => p.name).join(', ')}</div>
        );
      } else if (correctAnswer) {
        return (
          <DisplayAnswer
            correctAnswer={correctAnswer}
            answerImg={answerImg}
            selectedOption={selectedOption}
            answerContext={answerContext}
            standup={standup}
            handlePlayAgain={handlePlayAgain}
            answerAnimationState={answerAnimationState}
            setAnswerAnimationState={setAnswerAnimationState}
          />
        );
      } else {
        return <div>Waiting on other players...</div>;
      }
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
        newGame={newGame}
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
    const [winningPlayer, setWinningPlayer] = useState<Player>();
    const { nextSpinner, nextWinnerEmail, isComplete, categorySelector } =
      standup;
    console.log('categorySelector: ', categorySelector);

    if (!players || players.length < 1) {
      return <div />;
    }

    if (!standup) {
      return <div>Waiting for more players</div>;
    }

    const isPlayer = categorySelector?.email === user.email;

    return (
      <div className='container mx-16'>
        <div className='flex flex-wrap flex-col justify-around'>
          {isPlayer || newGame ? (
            selectCategory()
          ) : !selectedCategory ? (
            <div className='text-xl'>{nextSpinner?.name}, You're up!</div>
          ) : (
            <div className='text-xl'>
              {categorySelector?.name} chose {selectedCategory}
            </div>
          )}
          {selectedCategory ? (
            <ShowQuestion
              newGame={newGame}
              signedIn={signedIn}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              animationState={animationState}
              setAnimationState={setAnimationState}
            />
          ) : (
            <div />
          )}
          {/* {newGame && unanswered.length > 0 && (
            <div>Waiting on: {unanswered.map((p, i) => p.name).join(', ')}</div>
          )} */}
          {/* <ShowAnswer /> */}

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
  // const optionsModalClass = showOptions ? 'modal modal-open' : 'modal';

  const yourCategories = userCategories?.[userData?.name];

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
            <div className='basis-1/4'>
              {playerTableCard()}
              <StandupList standup={standup} />
            </div>
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
            <div className='basis-1/4'>
              {playerTableCard()}
              <StandupList standup={standup} />
            </div>
          </div>
          {optionsModal()}
        </div>
      );
    }
    return (
      <div className='container mx-auto'>
        <div className='flex flex-wrap justify-between'>
          <div className='basis-3/4 pr-6'>
            <PlayerSpinWheel />
            {correctAnswer && (
              <DisplayAnswer
                correctAnswer={correctAnswer}
                answerImg={answerImg}
                selectedOption={selectedOption}
                answerContext={answerContext}
                standup={standup}
                handlePlayAgain={handlePlayAgain}
                answerAnimationState={answerAnimationState}
                setAnswerAnimationState={setAnswerAnimationState}
              />
            )}
          </div>
          <div className='basis-1/4'>
            {playerTableCard()}
            <StandupList standup={standup} />
          </div>
        </div>
        {optionsModal()}
        <div className='btm-nav btm-nav-lg h-auto p-5 invisible md:visible'>
          <div>
            {!newGame && (
              <CategoryForm handleSaveCategory={handleSaveCategory} />
            )}
          </div>
          <div className='dropdown dropdown-top'>
            <label tabIndex={0} className='btn m-1'>
              Your Categories
            </label>
            <div
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 shadow bg-secondary rounded-box w-auto'
            >
              {yourCategories?.map((yourCategory, i) => {
                return (
                  <button
                    key={i}
                    className='btn-sm btn gap-2 my-2 bg-secondary-content'
                    onClick={() =>
                      socket.emit('deleteCategory', yourCategory.id)
                    }
                  >
                    {yourCategory.name}
                    <XMarkIcon className='h-6 w-6 text-slate-500' />
                  </button>
                );
              })}
            </div>
          </div>
          <div className='dropdown dropdown-top'>
            <label tabIndex={0} className='btn m-1'>
              Player Stats
            </label>
            <div
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box w-auto'
            >
              <PlayerScores playerStats={playerStats} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
