declare namespace JSX {
    interface IntrinsicElements {
        'spline-viewer': {
            url: string;
            [key: string]: any;
        };
    }
}

declare module '@splinetool/viewer' {
  export interface SplineViewer {
    load: (url: string) => Promise<void>;
    dispose: () => void;
    addEventListener: (event: string, callback: (event: unknown) => void) => void;
    removeEventListener: (event: string, callback: (event: unknown) => void) => void;
  }

  export default class Spline {
    constructor(canvas: HTMLCanvasElement);
    load: (url: string) => Promise<void>;
    dispose: () => void;
    addEventListener: (event: string, callback: (event: unknown) => void) => void;
    removeEventListener: (event: string, callback: (event: unknown) => void) => void;
  }
} 