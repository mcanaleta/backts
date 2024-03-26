export function deleteUndefinedFields(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

export function deleteUndefinedFieldsRecursive(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      deleteUndefinedFieldsRecursive(obj[key]);
    }
  }
  return obj;
}
