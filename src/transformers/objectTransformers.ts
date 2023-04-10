export function convertToNormalObject<T>(obj: any): T {
  const result: any = {};
  for (const key in obj) {
    const parts = key.split(/[[\].]+/);
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = obj[key];
      } else if (part.match(/^\d+$/)) {
        const index = parseInt(part);
        current[index] = current[index] || {};
        current = current[index];
      } else {
        current[part] =
          current[part] || (parts[i + 1].match(/^\d+$/) ? [] : {});
        current = current[part];
      }
    }
  }
  return result as T;
}
