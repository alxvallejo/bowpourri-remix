import { Player, Standup, AnimationAnswer } from '../types';
import { TypeWriteSequence, TypeWrite } from '../TypeWrite.client';

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

  const onComplete = (name: string) => {
    let newAnimationState = answerAnimationState;
    newAnimationState[name] = true;
    console.log('newAnimationState: ', newAnimationState);
    setAnswerAnimationState(newAnimationState);
  };

  const showNextGame = () => {
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
          {TypeWrite(
            'Bowpourri has concluded. You may carry on with your day.',
            7
          )}
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
          {TypeWriteSequence(
            'Congratulations!',
            'header',
            answerAnimationState['header'],
            onComplete
          )}
        </h2>
      ) : (
        <h2 className='text-info'>
          {TypeWriteSequence(
            'Sorry, you are incorrect.',
            'header',
            answerAnimationState['header'],
            onComplete
          )}
        </h2>
      )}

      <div>
        Correct Answer:{' '}
        {TypeWriteSequence(
          correctAnswer.option,
          'answer',
          answerAnimationState['answer'],
          onComplete,
          3
        )}
      </div>
      <div className='text-lg'>
        {TypeWriteSequence(
          answerContext,
          'context',
          answerAnimationState['context'],
          onComplete,
          5
        )}
      </div>
      {showImg()}
      {showNextGame()}
    </div>
  );
};
