export type UserParams = {
  username: string;
  password: string;
};

export type TeamParams = {
  name: string;
};

export type PilotParams = {
  name: string;
  team?: {
    name: string;
  };
};
