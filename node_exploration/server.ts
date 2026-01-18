// import { add } from "./math.js";

// console.log("Hello World");
// console.log(global);

// import os from "os";
// console.log(os.type());
// console.log(os.version());
// console.log(os.homedir());

// console.log(add(2, 3));

// import fs from "fs";

// fs.readFile("./dummy.txt", "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// console.log("Hello...");

// process.on("uncaughtException", (err) => {
//   console.error(`There was an uncaught error: ${err}`);
//   process.exit(1);
// });

import { logEvents } from "./logEvents.js";
import { EventEmitter } from "node:events";

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Listen for the log event
myEmitter.on("log", (msg: string) => logEvents(msg));
setTimeout(() => {
  // Emit log event
  myEmitter.emit("log", "Log event emitted");
}, 2000);

await logEvents("Message here - where will it be saved?");
