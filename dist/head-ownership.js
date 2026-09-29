function headOwnershipSuffix(identifierPrefix) {
  if (identifierPrefix === "") return "";
  let left = 2166136261;
  let right = 2654435769;
  for (let i = 0; i < identifierPrefix.length; i++) {
    const code = identifierPrefix.charCodeAt(i);
    left = Math.imul(left ^ code, 16777619);
    right = Math.imul(right ^ code, 2246822507);
    right = right << 13 | right >>> 19;
  }
  left ^= left >>> 16;
  left = Math.imul(left, 2246822507);
  left ^= left >>> 13;
  left = Math.imul(left, 3266489909);
  left ^= left >>> 16;
  right ^= identifierPrefix.length;
  right ^= right >>> 16;
  right = Math.imul(right, 2246822507);
  right ^= right >>> 13;
  right = Math.imul(right, 3266489909);
  right ^= right >>> 16;
  return "-" + (left >>> 0).toString(16).padStart(8, "0") + (right >>> 0).toString(16).padStart(8, "0");
}
function headOwnershipKey(key, identifierPrefix) {
  const suffix = headOwnershipSuffix(identifierPrefix);
  return suffix === "" ? key : key + suffix;
}
export {
  headOwnershipKey,
  headOwnershipSuffix
};
