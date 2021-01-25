# chokidar-incremental

Wrapper around [chokidar](https://github.com/paulmillr/chokidar) for incremental build process.

Might be useful for cases where you'd like to set callbacks depending on the result of the initial run, e.g. calling any `rebuild` function, which is derived from the initial `build`, for each file change.

It also displays the time taken to execute the `onStart`/`onChange` callback.


## Usage

```js
import { watch } from "@fal-works/chokidar-incremental";

watch(paths, onStart, options);
```

- `paths`: Glob pattern(s), just like `chokidar.watch()`.

- `onStart` (async): Called once when ready.  
Should return `onChange` (async) and `onExit` (optional).

- `options` (optional):
    - `onStartMessage`: message factory for `onStart`.
    - `onChangeMessage`: message factory for `onChange`.
    - `chokidarOptions`: options for the original chokidar API.

See type declaration for details.


## Console output

Looks like this:

```text
Initial run > Done. (31 ms)
Watching files for changes...
Change src\main.ts > Done. (13 ms)
Change src\setup.ts > Done. (13 ms)
Change src\main.ts > Done. (8 ms)
Stop watching.
```
