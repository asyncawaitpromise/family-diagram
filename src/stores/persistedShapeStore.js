import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CANVAS_CONFIG } from '../constants/canvas';
import { useCanvasStore } from './canvasStore';

export const usePersistedShapeStore = create(
  persist(
    (set, get) => ({
      shapes: [],
      connections: [],
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

      updateShapePosition: (id, newPos) => {
        const state = get();
        const shape = state.shapes.find(s => s.id === id);
        
        // Always log to console for debugging
        console.log('STORE updateShapePosition called', { id, newPos, shapeFound: !!shape });
        
        // Get debug logging function
        const debugLog = () => {
          try {
            const { debugLog: logFn } = require('./interactionStore').useInteractionStore.getState();
            return logFn;
          } catch {
            return () => {}; // Fallback if store not available
          }
        };
        
        if (shape) {
          debugLog()('SHAPE_POSITION_UPDATE', `Shape ${id} position updated in store`, {
            shapeId: id,
            oldPosition: { x: shape.x, y: shape.y },
            newPosition: newPos,
            delta: { x: newPos.x - shape.x, y: newPos.y - shape.y }
          });
        }
        
        set((state) => ({
          shapes: state.shapes.map(shape => 
            shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
          ),
        }));
      },

      getSelectedShape: () => {
        const { shapes, selectedId } = get();
        return shapes.find(shape => shape.id === selectedId);
      },

      addConnection: (fromId, toId) => {
        const newConnection = {
          id: Date.now().toString(),
          fromId,
          toId,
        };
        
        set((state) => ({
          connections: [...state.connections, newConnection],
        }));
      },

      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter(conn => conn.id !== id),
      })),

      clearAll: () => set({ shapes: [], connections: [], selectedId: null }),

      setShapes: (shapes) => set({ shapes, selectedId: null }),

      setConnections: (connections) => set({ connections }),
    }),
    {
      name: 'family-diagram-shapes',
      partialize: (state) => ({ shapes: state.shapes, connections: state.connections }), // Only persist shapes and connections, not selectedId
    }
  )
);