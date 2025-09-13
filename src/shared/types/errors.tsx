export interface ErrorResponseI {
  response: {
    status: number;
  };
}

export type Error = {
  [key: string]: string;
};
