export function findArrayOfArraysRecursive(
  obj: any,
  nestedCount = 0,
  path = ""
): boolean {
  if (typeof obj !== "object") {
    return false;
  }
  if (!obj) {
    return false;
  }
  if (Array.isArray(obj)) {
    nestedCount++;
    if (nestedCount > 1) {
      console.log(`Nested array found at ${path}`);
      return true;
    }
    return obj.some((item, i) =>
      findArrayOfArraysRecursive(item, nestedCount, `${path}[${i}]`)
    );
  }

  return Object.entries(obj).some(([key, value]) =>
    findArrayOfArraysRecursive(value, nestedCount, `${path}.${key}`)
  );
}

export function stripRecursiveArrayofArraysInPlace(obj: any) {
  for (const k in obj) {
    if (obj[k] === null || obj[k] === undefined) {
      continue;
    }
    if (Array.isArray(obj[k])) {
      if (Array.isArray(obj[k][0])) {
        delete obj[k];
      } else {
        stripRecursiveArrayofArraysInPlace(obj[k]);
      }
    } else if (typeof obj[k] === "object") {
      stripRecursiveArrayofArraysInPlace(obj[k]);
    }
  }
}
