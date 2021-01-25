import * as chokidar from "chokidar";
import { log } from "../util/log.js";

export type Options = {
  /** Paths of Glob patterns to watch. */
  paths: string | readonly string[];

  onChange(path: string): void;
  onExit?: NodeJS.ExitListener;
  chokidarOptions?: chokidar.WatchOptions;
};

export const createWatcher = (options: Options): chokidar.FSWatcher => {
  const watcher = chokidar.watch(options.paths, options.chokidarOptions);
  const { onChange, onExit } = options;

  watcher.on("ready", () => {
    log("Watching files for changes...");
    watcher.on("change", (path) => {
      log(`Changed: ${path}`);
      onChange(path);
    });

    process.on("SIGINT", () => process.exit(0));
    process.on("exit", () => log("Stop watching."));
    if (onExit) process.on("exit", onExit);
  });

  return watcher;
};
