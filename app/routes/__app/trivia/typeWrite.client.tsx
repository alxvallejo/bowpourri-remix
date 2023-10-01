import Typewriter from 'react-ts-typewriter';
import { ClientOnly } from 'remix-utils';
import { useState } from 'react';

export const TypeWrite = (text: string, delay: number | null = null) => {
  const [start, setStart] = useState(false);
  if (delay) {
    setTimeout(() => {
      console.log('setting start to true for ' + name, delay);
      setStart(true);
    }, delay * 1000);
  } else {
    setStart(true);
  }

  if (start) {
    return (
      <ClientOnly fallback={<div />}>
        {() => <Typewriter text={text} speed={15} cursor={false} />}
      </ClientOnly>
    );
  } else {
    return <div />;
  }
};

export const TypeWriteSequence = (
  text: string,
  name: string,
  complete: boolean,
  onComplete: (name: string) => void,
  delay: number = 0
) => {
  const [start, setStart] = useState(false);
  console.log('delay: ', delay);
  setTimeout(() => {
    console.log('setting start to true for ' + name, delay);
    setStart(true);
  }, delay * 1000);

  if (complete) {
    return <div>{text}</div>;
  }

  if (start) {
    return (
      <ClientOnly fallback={<div />}>
        {() => (
          <Typewriter
            text={text}
            speed={15}
            onFinished={() => onComplete(name)}
            cursor={false}
          />
        )}
      </ClientOnly>
    );
  } else {
    return <div />;
  }
};
