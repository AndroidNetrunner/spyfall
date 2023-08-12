import { UserId } from "./isValidUserId";

export type Vote = {
    [key in UserId]?: null | boolean;
  };
