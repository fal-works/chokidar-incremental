import { log } from "./log.js";

export const measure = async <S, T>(
  callback: (arg: S) => Promise<T>,
  arg: S
) => {
  const start = new Date();
  const result = await callback(arg);
  const end = new Date();

  return {
    duration: end.getTime() - start.getTime(),
    result,
  };
};

export const measureAndLog = async <S, T>(
  callback: (arg: S) => Promise<T>,
  arg: S,
  getMessage: (result: T) => string
) => {
  const { duration, result } = await measure(callback, arg);
  log(`${getMessage(result)} (${duration} ms)`);
  return result;
};
