/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Utility to compare two version objects and detect which fields changed.
 * - compareVersions(current, previous, keys?) -> Record<string, boolean>
 * - If `keys` is not provided, compares all keys present in `current`.
 * - For objects/arrays uses JSON.stringify for shallow deep-equality check.
 */

export const compareVersions = <T extends Record<string, any>>(
  current: T,
  previous?: T,
  keys?: Array<keyof T>
): Record<string, boolean> => {
  const result: Record<string, boolean> = {};
  if (!previous) {
    // No previous version to compare against -> treat as no changes
    return result;
  }

  const fields = keys ? (keys as string[]) : Object.keys(current || {});

  for (const k of fields) {
    const cur = (current as any)[k];
    const prev = (previous as any)[k];

    if (Array.isArray(cur) || Array.isArray(prev)) {
      result[k] = JSON.stringify(cur || []) !== JSON.stringify(prev || []);
      continue;
    }

    if (cur && typeof cur === "object") {
      // shallow deep-compare for objects
      result[k] = JSON.stringify(cur) !== JSON.stringify(prev);
      continue;
    }

    result[k] = cur !== prev;
  }

  return result;
};

export default compareVersions;
