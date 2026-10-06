declare module "react-water-wave" {
  import React, { ReactNode } from "react";

  interface WaterWaveProps {
    imageUrl: string;
    dropRadius?: number;
    perturbance?: number;
    resolution?: number;
    className?: string;
    children?: (methods: any) => ReactNode;
  }

  const WaterWave: React.FC<WaterWaveProps>;
  export default WaterWave;
}
