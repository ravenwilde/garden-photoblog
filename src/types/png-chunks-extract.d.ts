declare module 'png-chunks-extract' {
  function extract(buffer: Buffer | Uint8Array | ArrayBuffer): Array<{ name: string; data: Buffer }>;
  export default extract;
}
