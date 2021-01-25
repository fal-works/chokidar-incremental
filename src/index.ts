import { createWatcher } from "./chokidar/index.js";
import { measureAndLog } from "./util/date.js";

import type { WatchOptions, FSWatcher } from "chokidar";

/**
 * Functions to be called during the watch mode.
 */
export type WatchCallbacks<T> = {
  onChange: (changedPath: string) => Promise<T>;
  onExit?: NodeJS.ExitListener;
};

/**
 * Constructs and runs a file watcher.
 *
 * @param filePatterns Glob pattern(s) of files to watch.
 * @param onStart Called once when the watcher is ready. This should return
 * `onChange` and (optionally) `onExit`.
 */
export const watch = async <T>(
  filePatterns: string | readonly string[],
  onStart: () => Promise<WatchCallbacks<T>>,
  options?: {
    onStartMessage?: () => string;
    onChangeMessage?: (result: T) => string;
    chokidarOptions?: WatchOptions;
  }
): Promise<FSWatcher> => {
  const { onStartMessage, onChangeMessage, chokidarOptions } = options || {};

  const getStartMsg = onStartMessage || (() => "Completed onStart task.");
  const getChangeMsg = onChangeMessage || (() => "Completed onChange task.");

  const watchCallbacks = await measureAndLog(onStart, undefined, getStartMsg);
  const onChangeCallback = watchCallbacks.onChange;

  return createWatcher(filePatterns, {
    onChange: (path: string) =>
      measureAndLog(onChangeCallback, path, getChangeMsg),
    onExit: watchCallbacks.onExit,
    chokidarOptions,
  });
};
