export async function limitConcurrency<T>(
  pool: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  if (tasks.length === 0) return [];

  const concurrency = Math.max(1, Math.min(pool, tasks.length));
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    const currentIndex = nextIndex++;
    if (currentIndex >= tasks.length) return;

    results[currentIndex] = await tasks[currentIndex]();
    await runNext();
  }

  const workers = Array(concurrency)
    .fill(null)
    .map(() => runNext());

  await Promise.all(workers);
  return results;
}
