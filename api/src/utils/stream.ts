const stream = {
  write: (message: string) => {
    console.info(message.trim());
  },
};
export { stream };
