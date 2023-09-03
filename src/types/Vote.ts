import { UserId } from './UserId';

export const NO_VOTE_YET = '';

export type Vote = {
  [key in UserId]?: typeof NO_VOTE_YET | boolean;
};
