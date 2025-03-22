declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': {
      url: string;
      'loading-anim-type'?: string;
      [key: string]: string | undefined;
    }
  }
}

declare module '@splinetool/react-spline' {
  import { ComponentType } from 'react';

  interface SplineProps {
    scene: string;
    onLoad?: (splineApp: unknown) => void;
  }

  const Spline: ComponentType<SplineProps>;
  export default Spline;
} 