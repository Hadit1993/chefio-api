export function snakeToCamel<T>(obj: any): T {
  const camelObj: any = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
      );
      camelObj[camelKey] = obj[key];
    }
  }
  return camelObj as T;
}
