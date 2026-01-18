import { format } from "date-fns";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function logEvents(message: string): Promise<void> {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`;
  console.log(logItem);

  try {
    const projectRoot = path.join(__dirname, "..");
    const logsDir = path.join(projectRoot, "logs");
    await fs.mkdir(logsDir, { recursive: true });
    await fs.appendFile(path.join(logsDir, "eventLog.txt"), logItem);
  } catch (err) {
    console.error("Failed to write log:", err);
  }
}
