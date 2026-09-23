export async function withDeadline<T>(
  task: (signal: AbortSignal) => Promise<T>,
  milliseconds: number,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error("Request timed out");
      error.name = "TimeoutError";
      controller.abort(error);
      reject(error);
    }, milliseconds);
  });
  try {
    return await Promise.race([task(controller.signal), timeout]);
  } finally {
    clearTimeout(timer);
  }
}
