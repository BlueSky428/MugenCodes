import { promises as fs } from "fs";
import path from "path";

import type { ContactPayload } from "./validation";

export type ContactSubmission = ContactPayload & {
  id: string;
  submittedAt: string;
};

const submissionsPath = path.join(process.cwd(), "data", "submissions.json");

export const storeSubmission = async (submission: ContactSubmission) => {
  const existing = await readSubmissions();
  existing.push(submission);
  await fs.mkdir(path.dirname(submissionsPath), { recursive: true });
  await fs.writeFile(submissionsPath, JSON.stringify(existing, null, 2), "utf8");
};

const readSubmissions = async () => {
  try {
    const raw = await fs.readFile(submissionsPath, "utf8");
    return JSON.parse(raw) as ContactSubmission[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};
