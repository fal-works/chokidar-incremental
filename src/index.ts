import { createWatcher } from "./chokidar/index.js";
import { createTaskRunner } from "./util/task.js";
import { log } from "./util/log.js";

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

  const defaultMessage = () => "done.";
  const runOnStart = createTaskRunner(log, onStartMessage || defaultMessage);
  const runOnChange = createTaskRunner(log, onChangeMessage || defaultMessage);

  log("Initialize file watcher.");
  const watchCallbacks = await runOnStart(onStart, undefined);
  const onChangeCallback = watchCallbacks.onChange;

  return createWatcher(paths, {
    onChange: (path: string) => runOnChange(onChangeCallback, path),
    onExit: watchCallbacks.onExit,
    chokidarOptions,
  });
};
