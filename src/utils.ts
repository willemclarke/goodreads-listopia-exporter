export const sanitize = (value: string): string => {
  return value.replace(/(\r\n\t|\n|\r|\t)/gm, '');
};
