import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  alt?: string;
  ar?: boolean | string;
  "ar-modes"?: string;
  "ar-placement"?: string;
  "ar-scale"?: string;
  "camera-controls"?: boolean | string;
  "touch-action"?: string;
  "shadow-intensity"?: string;
  "environment-image"?: string;
  poster?: string;
  loading?: string;
  reveal?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}
