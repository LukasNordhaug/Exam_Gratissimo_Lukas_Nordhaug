export function parseId(param: string | string[]): number | null {
  const id = parseInt(Array.isArray(param) ? param[0] : param);
  return isNaN(id) || id <= 0 ? null : id;
}
