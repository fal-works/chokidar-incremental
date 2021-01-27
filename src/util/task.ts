import { println } from "./print.js";

/**
 * @param getMessage Message factory, which receives task argument/result.
 * @template S Argument type of tasks.
 * @template T Return type of acceptable tasks.
 * @template U Return type of given tasks.
 */
export const createTaskRunner = <S, T>(
  getMessage: (taskArg: S, taskResult: T) => string
) => {
  /**
   * @param task Any callback function.
   * @param arg Argument to be passed to `task`.
   */
  const runTask = async <U extends T>(
    task: (arg: S) => Promise<U>,
    arg: S
  ): Promise<U> => {
    const start = new Date();
    const result = await task(arg);
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    println(`${getMessage(arg, result)} (${duration} ms)`);

    return result;
  };

  return runTask;
};
