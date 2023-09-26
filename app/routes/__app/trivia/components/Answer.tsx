import { Player, Standup } from '../types';

export const displayAnswer = (
  correctAnswer,
  answerImg,
  selectedOption,
  answerContext,
  standup: Standup,
  handlePlayAgain
) => {
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

  const { nextSpinner } = standup;

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
      return <div className='text-lg'>No next spinner</div>;
    }
  };

  const isCorrect = correctAnswer.option == selectedOption;
  if (isCorrect) {
    return (
      <div className='prose lg:prose-md mb-6'>
        <h2 className='text-success'>Congratulations!</h2>
        <div>Correct Answer: {correctAnswer.option}</div>
        <div className='text-lg'>{answerContext}</div>
        {showImg()}
        {showNextGame()}
      </div>
    );
  } else {
    return (
      <div className='prose lg:prose-md mb-6'>
        <h3 className='text-info'>Sorry, you are incorrect.</h3>
        <div>Correct Answer: {correctAnswer.option}</div>
        <div className='text-lg'>{answerContext}</div>
        {showImg()}
        {showNextGame()}
      </div>
    );
  }
};

//   const handleAnswer = ({ seconds, completed }) => {
//     if (correctAnswer) {
//       displayAnswer();
//     } else {
//       return <div>Letting you change your mind for {seconds} seconds...</div>;
//     }
//   };

//   const ShowAnswer = () => {
//     if (newGame) {
//       const ms = ANSWER_BUFFER * 1000;
//       return (
//         <div>
//           <Countdown date={Date.now() + ms} renderer={handleAnswer} />
//         </div>
//       );
//     } else {
//       return <div />;
//     }
//   };
