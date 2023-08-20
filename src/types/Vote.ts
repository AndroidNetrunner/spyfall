import { UserId } from "./UserId";

export type Vote = {
    [key in UserId]?: null | boolean;
  };
