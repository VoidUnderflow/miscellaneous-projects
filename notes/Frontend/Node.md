### Node.JS patterns - article
Summary of: https://kashw1n.com/blog/nodejs-2025/ - from yCombinators page
- ESM > CommonJS; CommonJS explicit exports, synchronous imports;
- Importing a Node.js builtin with the `node:` prefix, e.g: `node:fs/promises`
- APIs directly into the runtime: Fetch API (with built-in timeout support): e.g:
  `const response = await fetch(url, {signal: AbortSignal.timeout(5000)})`;
- `AbortController` for cancelling operations gracefully (e.g: could use the controller.signal as an argument for fetch, then abort the controller on timeouts, or event trigger, etc.) - easy way to shoot yourself in the foot?
- Built-in test runner (+ watch mode with `node --test --watch`);
- `error.stack` for logging the stack trace :O (how didn't I know of this?)
- Async iterators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator
- Stream processing: `node: stream`: `Transform, Readable`, etc.
- Better web streams, similar to above.
- Worker threads for CPU heavy tasks.
- Built-in watch mode.
- Can restrict what files/URLs the node app has access to (principle of least privilege):
```bash
node --experimental-permission --allow-fs-read=./data --allow-fs-write=./logs app.js
```
```bash
node --experimental-permission --allow-net=api.example.com app.js
```
Good for processing untrusted code / security compliance.
- Built-in performance measurement :O:
`node:perf_hooks` -> `PerformanceObserver, performance`.
e.g: `performance.mark`, `performance.measure`
Already used PerformanceObserver for measuring something at work.
- Built in diagnostics (`node:diagnostics_channel`) - god damn. Separate channels for separate things that can happen: `app:database`, `app:http`.
- Can conditionally load packages.