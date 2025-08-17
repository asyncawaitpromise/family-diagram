// Store exports for easier importing
export { useCanvasStore } from './canvasStore';
export { usePersistedShapeStore } from './persistedShapeStore';
export { useInteractionStore } from './interactionStore';

// Store devtools integration (if you want to add devtools later)
export const storeNames = {
  canvas: 'CanvasStore',
  shapes: 'ShapeStore', 
  interactions: 'InteractionStore'
};