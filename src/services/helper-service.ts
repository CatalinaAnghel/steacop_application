export function toISOLocale(date: Date): string {
    const z = (n: string | number) => ('0' + n).slice(-2);
    let off = date.getTimezoneOffset();
    const sign = off < 0 ? '+' : '-';
    off = Math.abs(off);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -1) + sign + z(off / 60 | 0) + ':' + z(off % 60);
}