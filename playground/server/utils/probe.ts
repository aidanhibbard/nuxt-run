/** Shared server util — should be importable from run scripts via ~/server/utils or relative path / auto-import. */
export function formatProbeLabel(label: string): string {
  return `[probe] ${label}`
}
