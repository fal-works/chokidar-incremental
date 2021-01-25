import { createWatcher } from "./chokidar/index.js";
import { measureAndLog } from "./util/date.js";

import type { WatchOptions, FSWatcher } from "chokidar";

/**
 * Constructs and runs a file watcher.
 *
 * @param filePatterns Glob pattern(s) of files to watch.
 * @param onStart Called once when the watcher is ready and returns a callback
 * function to be run each time any file is changed.
 */
export const watch = async <T>(
  filePatterns: string | readonly string[],
  onStart: () => Promise<(pattern: string) => Promise<T>>,
  options?: {
    onExit?: NodeJS.ExitListener;
    onStartMessage?: () => string;
    onChangeMessage?: (result: T) => string;
    chokidarOptions?: WatchOptions;
  }
): Promise<FSWatcher> => {
  const { onExit, onStartMessage, onChangeMessage, chokidarOptions } =
    options || {};

  const getStartMsg = onStartMessage || (() => "Completed onStart task.");
  const getChangeMsg = onChangeMessage || (() => "Completed onChange task.");

  const onChangeCallback = await measureAndLog(onStart, undefined, getStartMsg);
  const onChange = (path: string) =>
    measureAndLog(onChangeCallback, path, getChangeMsg);

  return createWatcher({
    paths: filePatterns,
    onChange,
    onExit,
    chokidarOptions,
  });
};
