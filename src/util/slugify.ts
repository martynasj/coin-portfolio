// todo: double check if only valid symbols are used
// so no url encoding needed
export function slugify(text: string): string {
  return text.toLowerCase()
    .trim()
    .replace(/[;\\/:*?\"<>|&',.\(\)\[\]]+/g, '')
    .replace(/\s+/g, '-')
}