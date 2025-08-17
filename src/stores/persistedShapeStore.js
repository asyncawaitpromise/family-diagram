import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CANVAS_CONFIG } from '../constants/canvas';
import { useCanvasStore } from './canvasStore';

export const usePersistedShapeStore = create(
  persist(
    (set, get) => ({
      shapes: [],
      selectedId: null,

      // Actions
      addShape: (type, x = null, y = null) => {
        // Get stage size from canvas store
        const canvasState = useCanvasStore.getState();
        const size = canvasState.stageSize;
        
        const newShape = {
          id: Date.now().toString(),
          type,
          x: x !== null ? x : Math.random() * (size.width - 100) + 50,
          y: y !== null ? y : Math.random() * (size.height - 100) + 50,
          fill: CANVAS_CONFIG.SHAPES.DEFAULT_FILL,
          draggable: false,
        };
        
        set((state) => ({
          shapes: [...state.shapes, newShape],
          selectedId: newShape.id,
        }));
      },

      selectShape: (id) => set({ selectedId: id }),

      deselectAll: () => set({ selectedId: null }),

      deleteSelected: () => set((state) => {
        if (!state.selectedId) return state;
        
        return {
          shapes: state.shapes.filter(shape => shape.id !== state.selectedId),
          selectedId: null,
        };
      }),

      updateShapePosition: (id, newPos) => set((state) => ({
        shapes: state.shapes.map(shape => 
          shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
        ),
      })),

      getSelectedShape: () => {
        const { shapes, selectedId } = get();
        return shapes.find(shape => shape.id === selectedId);
      },

      clearAll: () => set({ shapes: [], selectedId: null }),
    }),
    {
      name: 'family-diagram-shapes',
      partialize: (state) => ({ shapes: state.shapes }), // Only persist shapes, not selectedId
    }
  )
);