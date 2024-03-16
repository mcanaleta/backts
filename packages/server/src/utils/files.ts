import { stat } from "fs/promises";

export async function isFile(filePath: string): Promise<boolean> {
  try {
    // Use fs.promises.stat to get the stats of the filePath and await its resolution.
    const stats = await stat(filePath);

    // Return true if the filePath is a file, false otherwise.
    return stats.isFile();
  } catch (error: any) {
    // If an error occurs (e.g., the file doesn't exist), log the error and return false.
    if (error?.code !== "ENOENT") {
      throw error;
    }

    return false;
  }
}
