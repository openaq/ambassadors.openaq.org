export default {
  compilers: {
    scss: (text: string) => [...text.matchAll(/(?<=@)use[^;]+/g)].join('\n'),
  },
};
