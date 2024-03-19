export async function mapAsync<T, R>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => Promise<R>
): Promise<R[]> {
  return await Promise.all(array.map(callback));
}
