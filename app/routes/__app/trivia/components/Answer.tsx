import { useState } from 'react';
import { Player, Standup, AnimationAnswer, AnimationSequence } from '../types';
import { TypeWriteSequence, TypeWrite } from '../typeWrite.client';
import { createSequence } from '../utils';

const defaultSequence = createSequence([
  'header',
  'answer',
  'context',
  'action',
]);

export const DisplayAnswer = ({
  correctAnswer,
  answerImg,
  selectedOption,
  answerContext,
  standup,
  handlePlayAgain,
  answerAnimationState,
  setAnswerAnimationState,
}) => {
  const [sequence, setSequence] = useState<AnimationSequence>(defaultSequence);
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

  const { nextSpinner } = standup;

  const onComplete = (index: number) => {
    let newAnimationState = Object.assign({}, sequence);
    newAnimationState[index]['complete'] = true;
    setSequence(newAnimationState);
  };

  const ShowNextGame = () => {
    if (nextSpinner) {
      return (
        <div className='text-center mt-3'>
          <button className='btn-primary btn' onClick={handlePlayAgain}>
            {nextSpinner.name} is next!
          </button>
        </div>
      );
    } else {
      return (
        <div className='text-lg'>
          <TypeWriteSequence
            text={'Bowpourri has concluded. You may carry on with your day.'}
            name={'action'}
            animationSequence={sequence}
            onComplete={onComplete}
            index={3}
          />
        </div>
      );
    }
  };

  const isCorrect = correctAnswer.option == selectedOption;

  if (!correctAnswer) {
    console.log('no correct answer');
    return <div />;
  }

  return (
    <div className='prose lg:prose-md my-6 mx-16'>
      {isCorrect ? (
        <h2 className='text-success'>
          <TypeWriteSequence
            text={'Congratulations!'}
            name={'header'}
            animationSequence={sequence}
            onComplete={onComplete}
            index={0}
          />
        </h2>
      ) : (
        <h2 className='text-info'>
          <TypeWriteSequence
            text={'Sorry, you are incorrect.'}
            name={'header'}
            animationSequence={sequence}
            onComplete={onComplete}
            index={0}
          />
        </h2>
      )}

      <div>
        Correct Answer:{' '}
        <TypeWriteSequence
          text={correctAnswer.option}
          name={'answer'}
          animationSequence={sequence}
          onComplete={onComplete}
          index={1}
        />
      </div>
      <div className='text-lg'>
        <TypeWriteSequence
          text={answerContext}
          name={'context'}
          animationSequence={sequence}
          onComplete={onComplete}
          index={2}
        />
      </div>
      {showImg()}
      <ShowNextGame />
    </div>
  );
};
