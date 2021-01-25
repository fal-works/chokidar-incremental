import { println } from "./print.js";

/**
 * @param log Any logging function.
 * @param getMessage Message factory, which receives the task result.
 */
export const createTaskRunner = <T>(getMessage: (result: T) => string) => {
  /**
   * @param task Any callback function.
   * @param arg Argument to be passed to `task`.
   */
  const runTask = async <U extends T, V>(
    task: (arg: V) => Promise<U>,
    arg: V
  ): Promise<U> => {
    const start = new Date();
    const result = await task(arg);
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    println(`${getMessage(result)} (${duration} ms)`);

    return result;
  };

  return runTask;
};
