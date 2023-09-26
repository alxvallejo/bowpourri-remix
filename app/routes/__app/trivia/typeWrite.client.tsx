import Typewriter from 'react-ts-typewriter';
import { ClientOnly } from 'remix-utils';

export const typeWrite = (
  text: string,
  currentIndex: number,
  order: number,
  handleNext: () => void
) => {
  return text;
  if (currentIndex !== order) {
    return text;
  }
  console.log('currentIndex: ', currentIndex);
  console.log('order: ', order);
  return (
    <ClientOnly fallback={<div />}>
      {() => <Typewriter text={text} speed={5} onFinished={handleNext} />}
    </ClientOnly>
  );
};
