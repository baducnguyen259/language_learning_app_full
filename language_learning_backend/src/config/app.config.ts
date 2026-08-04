export default () => ({
  app: {
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
  },
});
