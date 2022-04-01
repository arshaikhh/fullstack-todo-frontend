export default function dateComparison(d1: string, d2: string): boolean {
  const time1 = new Date(d1).getTime();
  const time2 = new Date(d2).getTime();
  return time1 > time2;
}
