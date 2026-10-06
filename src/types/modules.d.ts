declare module 'mammoth' {
  interface MammothResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }

  interface MammothOptions {
    arrayBuffer?: ArrayBuffer;
  }

  export function convertToHtml(options: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
  export function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
}
