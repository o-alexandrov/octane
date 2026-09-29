function inspectNativeReadSource(source, observedVersion) {
  return {
    observedVersion,
    currentVersion: source.getVersion(),
    source: source.inspect?.() ?? null
  };
}
function inspectNativeReadWitness(witness) {
  return {
    mixed: witness.mixed,
    reads: Array.from(
      witness.reads,
      ([source, version]) => inspectNativeReadSource(source, version)
    )
  };
}
export {
  inspectNativeReadSource,
  inspectNativeReadWitness
};
