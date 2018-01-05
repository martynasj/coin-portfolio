let id = 0

export const Generator = {
  id(): string {
    return '' + id++
  },
}