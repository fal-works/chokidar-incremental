import * as chokidar from "chokidar";
import { println } from "../util/print.js";

type Paths = Parameters<typeof chokidar.watch>[0];

export const createWatcher = (
  paths: Paths,
  options: {
    onChange: (path: string) => void;
    onExit?: NodeJS.ExitListener;
    chokidarOptions?: chokidar.WatchOptions;
  }
): chokidar.FSWatcher => {
  const watcher = chokidar.watch(paths, options.chokidarOptions);
  const { onChange, onExit } = options;

  watcher.on("ready", () => {
    println("Watching files for changes...");

    watcher.on("change", onChange);

    process.on("SIGINT", () => process.exit(0));
    process.on("exit", () => println("Stop watching."));
    if (onExit) process.on("exit", onExit);
  });

  return watcher;
};
