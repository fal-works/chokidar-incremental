export const log = (message: string): void => {
  process.stdout.write(message);
  process.stdout.write("\n");
};
