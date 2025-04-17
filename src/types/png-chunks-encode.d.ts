declare module 'png-chunks-encode' {
  function encode(chunks: Array<{ name: string; data: Buffer }>): Buffer;
  export default encode;
}
