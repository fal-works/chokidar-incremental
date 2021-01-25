import { createWatcher } from "./chokidar/index.js";
import { measureAndLog } from "./util/date.js";

import type { WatchOptions, FSWatcher } from "chokidar";

type Options<T> = {
  onStartMessage?: () => string;
  onChangeMessage?: (result: T) => string;
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

  const getStartMsg = onStartMessage || (() => "Completed onStart task.");
  const getChangeMsg = onChangeMessage || (() => "Completed onChange task.");

  const watchCallbacks = await measureAndLog(onStart, undefined, getStartMsg);
  const onChangeCallback = watchCallbacks.onChange;

  return createWatcher(paths, {
    onChange: (path: string) =>
      measureAndLog(onChangeCallback, path, getChangeMsg),
    onExit: watchCallbacks.onExit,
    chokidarOptions,
  });
};
