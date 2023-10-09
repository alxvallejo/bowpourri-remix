import { AnimationSequence } from './types';

export const createSequence = (keys: string[]): AnimationSequence => {
  return keys.map((key) => {
    return {
      key,
      complete: false,
    };
  });
};
