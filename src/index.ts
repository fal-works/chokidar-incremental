import { createWatcher } from "./chokidar/index.js";
import { createTaskRunner } from "./util/task.js";

import type { WatchOptions, FSWatcher } from "chokidar";

/**
 * Options that mey be passed to `watch()`.
 */
export type Options<T> = {
  onStartMessage?: () => string;
  onChangeMessage?: (path: string, result: T) => string;
  chokidarOptions?: WatchOptions;
};

/**
 * Constructs and runs a file watcher.
 *
 * @param paths Glob pattern(s) of files to watch.
 * @param onStart Called once when the watcher is ready.
 * This should return `onChange` and (optionally) `onExit`.
 * @param options Other optional values.
 */
export const watch = async <T>(
  paths: string | readonly string[],
  onStart: () => Promise<{
    onChange: (path: string) => Promise<T>;
    onExit?: NodeJS.ExitListener;
  }>,
  options?: Options<T>
): Promise<FSWatcher> => {
  const { onStartMessage, onChangeMessage, chokidarOptions } = options || {};

  const runOnStart = createTaskRunner(
    onStartMessage || (() => "Initial run > Done.")
  );
  const runOnChange = createTaskRunner(
    onChangeMessage || ((path: string) => `Changed ${path} > Done.`)
  );

  const watchCallbacks = await runOnStart(onStart, undefined);
  const onChangeCallback = watchCallbacks.onChange;

  const warn = (err: unknown) => console.warn(err);

  return createWatcher(paths, {
    onChange: (path: string) => runOnChange(onChangeCallback, path).catch(warn),
    onExit: watchCallbacks.onExit,
    chokidarOptions,
  });
};
