export const sanitize = (value: string) => {
  return value.replace(/(\r\n\t|\n|\r|\t)/gm, "")
}