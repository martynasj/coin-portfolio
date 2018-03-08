export default {
  toUnix(date: Date): number {
    return Math.round(date.getTime() / 1000)
  },

  fromUnix(unix: number): Date {
    return new Date(unix * 1000)
  }
}