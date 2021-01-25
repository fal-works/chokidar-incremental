export const print = (s: string): void => {
  process.stdout.write(s);
};

export const println = (s: string): void => {
  process.stdout.write(s);
  process.stdout.write("\n");
};
