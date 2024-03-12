import { Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
export async function findFromCache<T>(
  id: string,
  map: Map<string, T>,
  dbFunc: (id: string) => Promise<T>,
): Promise<T> {
  if (!id) return null;
  let data: T;
  try {
    if (!map.has(id)) {
      data = await dbFunc(id);
      map.set(id, data);
      return data;
    }
    return map.get(id);
  } catch (error) {
    Logger.error(error.message);
    return null;
  }
}

export function handleErrorObject(error: { message: string }): null {
  Logger.error(error.message);
  return null;
}

export function idArrayToString(ids: string[]): string {
  if (!ids || ids.length === 0) return null;
  const notNullValues = ids.filter((id) => id);
  return notNullValues.map((id) => `'${id}'`).join(',');
}

export function arrayToMap<T, U extends keyof T>(array: T[], key: U) {
  if (!array || array.length === 0) return null;
  const map: Map<string, T> = new Map();
  array.forEach((arr: T) => {
    map.set(arr[key] as string, arr);
  });
  return map;
}

export function convertArrayToMapOfArray<T, U extends keyof T>(
  array: T[],
  key: U,
) {
  if (!array || array.length === 0) return null;
  const map: Map<string, T[]> = new Map();
  array.forEach((arr: T) => {
    const newEl: T = arr;
    if (map.has(arr[key] as string)) {
      const existing = map.get(arr[key] as string);
      map.set(arr[key] as string, [...existing, newEl]);
    } else map.set(arr[key] as string, [newEl]);
  });
  return map;
}

export function generateRandomPassword(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytesCount = Math.ceil((length * 3) / 4); // To avoid bias, we generate more bytes than necessary

  const randomBytesBuffer = randomBytes(randomBytesCount);
  let randomString = '';

  for (let i = 0; i < randomBytesBuffer.length; i++) {
    const randomIndex = randomBytesBuffer[i] % characters.length;
    randomString += characters.charAt(randomIndex);
  }

  return randomString.slice(0, length);
}

export function getUniqueIdFromArrayOfObjects<T, U extends keyof T>(
  array: T[],
  key: U,
) {
  if (!array || array.length === 0) return null;
  const distinctIds: string[] = [
    ...new Set(
      array
        .map((data) => data[key] as string)
        .filter((s) => s !== null && s !== undefined),
    ),
  ];
  return distinctIds;
}

export function mapToObject<T, U>(mapObject: Map<T, U>) {
  return Object.fromEntries(mapObject.entries());
}

export function getDistinctIdsWithCondition<T, U extends keyof T>(
  array: T[],
  key: U,
  conditionField: keyof T,
  conditionValue: unknown,
): string[] {
  if (!array || array.length === 0) return [];

  const distinctIds: string[] = [];
  const seenValues = new Set<string>();

  for (const item of array) {
    const id = item[key] as string;
    const fieldValue = item[conditionField];

    if (id !== null && fieldValue === conditionValue && !seenValues.has(id)) {
      seenValues.add(id);
      distinctIds.push(id);
    }
  }

  return distinctIds;
}
