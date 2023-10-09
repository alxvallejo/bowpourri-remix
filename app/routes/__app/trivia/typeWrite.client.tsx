import Typewriter from 'react-ts-typewriter';
import { ClientOnly } from 'remix-utils';
import { useState, useEffect } from 'react';
import {
  AnimationAnswer,
  AnimationSequence,
  AnimationsComplete,
  TypeWriteSequenceProps,
} from './types';

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

export const TypeWriteSequence = ({
  text,
  name,
  animationSequence,
  onComplete,
  index = 0,
}: TypeWriteSequenceProps) => {
  const [start, setStart] = useState(false);

  const [complete, setComplete] = useState(
    animationSequence[index]['complete'] || false
  );

  // const complete = animationSequence[index]?.['complete'];

  useEffect(() => {
    if (index === 0) {
      setStart(true);
    } else {
      // If previous index is complete, set start to true
      let prevIndex = index - 1;
      if (animationSequence[prevIndex]['complete']) {
        setStart(true);
      }
    }
    // if (animationSequence[index]['complete']) {
    //   setComplete(true);
    // }
  }, [animationSequence, index]);

  const handleOnFinish = () => {
    setComplete(true);
    onComplete(index);
  };

  if (complete) {
    console.log('complete', text);
    return <span>{text}</span>;
  }

  if (start) {
    // console.log('animationSequence: ', animationSequence);
    // debugger;
    return (
      <ClientOnly fallback={<span />}>
        {() => (
          <Typewriter
            text={text}
            speed={15}
            onFinished={handleOnFinish}
            cursor={false}
          />
        )}
      </ClientOnly>
    );
  } else {
    return <span />;
  }
};
