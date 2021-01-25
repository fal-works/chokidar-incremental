/**
 * @param log Any logging function.
 * @param getMessage Message factory, which receives the task result.
 */
export const createTaskRunner = <T>(
  log: (message: string) => void,
  getMessage: (result: T) => string
) => {
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
    log(`${getMessage(result)} (${duration} ms)`);

    return result;
  };

  return runTask;
};
