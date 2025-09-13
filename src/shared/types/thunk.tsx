import { UseDispatch, UseSelector } from "react-redux";
import { Error } from "./errors";

export interface DefaultError {
  message: string;
  errors: Error;
}
export interface AsyncThunkAPI<T = DefaultError> {
  dispatch: UseDispatch;
  state: UseSelector;
  rejectValue: T;
}
