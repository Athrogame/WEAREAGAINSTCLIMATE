declare module 'three' {
  export class Color {
    constructor(hex: number);
    r: number;
    g: number;
    b: number;
    clone(): Color;
    lerp(color: Color, alpha: number): Color;
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
  }

  export class Euler {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
  }

  export class BufferAttribute {
    constructor(array: Float32Array, itemSize: number);
  }

  export class BufferGeometry {
    setAttribute(name: string, attribute: BufferAttribute): this;
    dispose(): void;
  }

  export class PointsMaterial {
    constructor(parameters?: Record<string, unknown>);
    size: number;
    opacity: number;
    dispose(): void;
  }

  export class Points {
    constructor(geometry: BufferGeometry, material: PointsMaterial);
    rotation: Euler;
    position: Vector3;
    scale: Vector3;
  }

  export class Object3D {
    add(object: Object3D | Points): this;
  }

  export class FogExp2 {
    constructor(color: number, density: number);
  }

  export class Scene extends Object3D {
    fog: FogExp2 | null;
  }

  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    position: Vector3;
    aspect: number;
    updateProjectionMatrix(): void;
    lookAt(x: number, y: number, z: number): void;
  }

  export class WebGLRenderer {
    constructor(parameters?: Record<string, unknown>);
    domElement: HTMLCanvasElement;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
    toneMapping: number;
    toneMappingExposure: number;
  }

  export const AdditiveBlending: number;
  export const ACESFilmicToneMapping: number;
}
