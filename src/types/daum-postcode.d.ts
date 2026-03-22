export {};

declare global {
  interface DaumPostcodeData {
    zonecode: string;
    address: string;
    roadAddress: string;
    jibunAddress: string;
  }

  interface DaumPostcodeOptions {
    oncomplete: (data: DaumPostcodeData) => void;
  }

  interface DaumPostcodeConstructor {
    new (options: DaumPostcodeOptions): {
      open: () => void;
      embed: (element: HTMLElement) => void;
    };
  }

  interface Window {
    daum?: {
      postcode?: {
        Postcode?: DaumPostcodeConstructor;
      };
    };
  }
}
