import { Queue } from "@forge/events";

const queue = new Queue({ key: "schema-migration-queue" });

import { applyMigrations } from "./001_create_topics_and_experts";

const RETRY_TIMEOUT_MS = 60000;

export async function runMigration() {
  const deadline = Date.now() + RETRY_TIMEOUT_MS;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const successfulMigrations = await applyMigrations();
      console.log("Migrations applied:", successfulMigrations);
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        "Migration attempt failed, retrying:",
        JSON.stringify(error, null, 2),
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Let the async events API retry the event within the retention window.
  throw lastError;
}

export const enqueueMigration = async () => {
  await queue.push({ body: {} });
};

export async function manualTrigger() {
  console.log("migration started");
  await runMigration();
  console.log("Migration finished");
  return {
    outputKey: "ok",
  };
}
