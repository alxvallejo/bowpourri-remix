import { useState, useEffect } from 'react';
import TailwindColor from '../../../../tailwindColor';
import { TypeWriteSequence } from '../TypeWrite.client';
import { AnimationSequence } from '../types';
import { createSequence } from '../utils';
const tailwindColor = new TailwindColor(null);

const CategoryCard = ({ category, selectedCategory, userData, socket }) => {
  const className = `btn btn-outline ${category.class} m-2 no-animation btn-sm md:btn-md`;
  const isDisabled = !!selectedCategory;
  const name = userData?.name || userData?.email;
  return (
    <button
      className={className}
      onClick={() => socket.emit('category', name, category.label)}
      disabled={isDisabled}
    >
      {category.label}
    </button>
  );
};

export const SelectCategoryCard = ({
  standup,
  selectedCategory,
  newGame,
  categories,
  players,
  minPlayers,
  userCategories,
  userData,
  socket,
}) => {
  console.log('standup: ', standup);
  if (!minPlayers) {
    return <div>Set min players!</div>;
  }
  if (players.length < minPlayers) {
    return (
      <div className='prose'>
        <h2>Waiting for more players...</h2>
      </div>
    );
  } else {
    const filteredCategories = selectedCategory
      ? categories.filter((x) => x.label === selectedCategory)
      : categories;
    if (selectedCategory) {
      if (standup?.nextSpinner?.name) {
        return (
          <div className='text-xl'>
            {standup?.categorySelector?.name} chose {selectedCategory}
          </div>
        );
      } else {
        return <div className='text-xl'>Bowpourri</div>;
      }
    }
    return (
      <div className='h-[100vw]'>
        Choose a category:
        <div className='flex flex-row flex-wrap items-start'>
          {filteredCategories.map((cat, i) => {
            return (
              <CategoryCard
                key={i}
                category={cat}
                selectedCategory={selectedCategory}
                userData={userData}
                socket={socket}
              />
            );
          })}
        </div>
        <div className='card text-center'>
          <div className='card-body overflow-y-auto h-full'>
            {Object.entries(userCategories).map(
              ([userName, userCats], index) => {
                const randomColor = tailwindColor.pick();
                return (
                  <div
                    className='card md:flex-row items-start justify-start text-center'
                    key={index}
                  >
                    <div className='card-title'>{userName}</div>
                    <div className='card-body flex-row items-start justify-start flex-wrap'>
                      {userCats.map((cat, i) => {
                        return (
                          <UserCategoryCard
                            key={i}
                            categoryName={cat.name}
                            color={randomColor}
                            selectedCategory={selectedCategory}
                            userData={userData}
                            socket={socket}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
                // return <UserCategoryCard key={i} category={cat} color="gray" />;
              }
            )}
          </div>
        </div>
      </div>
    );
  }
};

const UserCategoryCard = ({
  categoryName,
  color,
  selectedCategory,
  userData,
  socket,
}) => {
  // console.log('color: ', color);
  const className = `btn btn-outline ${color} m-2 no-animation btn-sm md:btn-md`;
  const isDisabled = !!selectedCategory;
  const name = userData?.name || userData?.email;
  return (
    <button
      className={className}
      onClick={() => socket.emit('category', name, categoryName)}
      disabled={isDisabled}
    >
      {categoryName}
    </button>
  );
};

const defaultSequence = createSequence([
  'question',
  'opt1',
  'opt2',
  'opt3',
  'opt4',
]);

export const ShowQuestion = ({
  newGame,
  signedIn,
  selectedOption,
  setSelectedOption,
}) => {
  const [sequence, setSequence] = useState<AnimationSequence>(defaultSequence);
  console.log('sequence: ', sequence);

  // useEffect(() => {

  //   setSequence(defaultSequence);
  // }, []);

  if (!newGame || !sequence) {
    return (
      <div>
        <h2>The game will begin momentarily</h2>
      </div>
    );
  } else {
    if (!signedIn) {
      return (
        <div className='prose flex flex-col items-start'>
          <h3 className='border-r-ghost p-5 text-info'>
            Game in progress. Click Join Game!
          </h3>
        </div>
      );
    }

    const onComplete = (index: number) => {
      let newAnimationState = Object.assign({}, sequence);
      newAnimationState[index]['complete'] = true;
      setSequence(newAnimationState);
    };

    return (
      <div className='prose flex flex-col items-start'>
        Today's question:
        <h3 className='border-r-ghost p-5 text-accent font-mono'>
          <TypeWriteSequence
            text={newGame.question}
            name={'question'}
            animationSequence={sequence}
            onComplete={onComplete}
            index={0}
          />
        </h3>
        {newGame.options?.map((option, i) => {
          const selected = selectedOption == option;
          const className = selected
            ? `btn btn-primary no-animation font-mono mt-2`
            : `btn btn-neutral no-animation font-mono mt-2`;
          const animationKey = `opt${i + 1}`;
          return (
            <div className='form-control' key={i}>
              <button
                className={className}
                onClick={() => setSelectedOption(option)}
              >
                <TypeWriteSequence
                  text={option}
                  name={animationKey}
                  animationSequence={sequence}
                  onComplete={onComplete}
                  index={i + 1}
                />
              </button>
            </div>
          );
        })}
        {/* {selectedOption && (
          <span className='countdown'>
            <span style={{ "--value": 5 }}></span>
          </span>
        )} */}
      </div>
    );
  }
};
