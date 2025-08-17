import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import TouchDragPreview from '../components/TouchDragPreview';
import { useCanvasStore } from '../stores/canvasStore';
import { usePersistedShapeStore } from '../stores/persistedShapeStore';
import { useDiagramStore } from '../stores/diagramStore';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';
import { useDragDropInteractions } from '../hooks/useDragDropInteractions';

const DiagramView = () => {
  const { diagramId } = useParams();
  const navigate = useNavigate();
  const stageRef = useRef();

  // Zustand stores
  const { stageScale, stageX, stageY, stageSize, isPanning, setStageSize, setCanvasState, getCanvasState } = useCanvasStore();
  const { shapes, connections, selectedId, selectedConnectionId, addShape, selectShape, selectConnection, deleteSelected, updateShapePosition, setShapes, setConnections } = usePersistedShapeStore();
  const { getCurrentDiagram, updateDiagramShapes, updateDiagramConnections, updateDiagramCanvasState, setCurrentDiagram } = useDiagramStore();

  // Custom hooks for interactions
  const {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove: canvasTouchMove,
    handleTouchEnd: canvasTouchEnd,
  } = useCanvasInteractions(stageRef);

  const {
    touchDragType,
    touchDragPosition,
    handleToolbarDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleToolbarTouchStart,
    handleTouchMove: dragTouchMove,
    handleTouchEnd: dragTouchEnd,
  } = useDragDropInteractions(stageRef);

  // Load diagram data when component mounts or diagramId changes
  useEffect(() => {
    if (diagramId) {
      setCurrentDiagram(diagramId);
      const currentDiagram = getCurrentDiagram();
      if (currentDiagram) {
        // Load shapes
        if (currentDiagram.shapes) {
          setShapes(currentDiagram.shapes);
        }
        // Load connections
        if (currentDiagram.connections) {
          setConnections(currentDiagram.connections);
        }
        // Load canvas state
        if (currentDiagram.canvasState) {
          setCanvasState(currentDiagram.canvasState);
        }
      }
    }
  }, [diagramId, setCurrentDiagram, getCurrentDiagram, setShapes, setConnections, setCanvasState]);

  // Save shapes to diagram whenever shapes change
  useEffect(() => {
    if (diagramId && shapes.length >= 0) {
      updateDiagramShapes(diagramId, shapes);
    }
  }, [shapes, diagramId, updateDiagramShapes]);

  // Save connections to diagram whenever connections change
  useEffect(() => {
    if (diagramId && connections.length >= 0) {
      updateDiagramConnections(diagramId, connections);
    }
  }, [connections, diagramId, updateDiagramConnections]);

  // Save canvas state to diagram whenever canvas position/zoom changes
  useEffect(() => {
    if (diagramId) {
      const currentCanvasState = getCanvasState();
      updateDiagramCanvasState(diagramId, currentCanvasState);
    }
  }, [stageX, stageY, stageScale, diagramId, getCanvasState, updateDiagramCanvasState]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setStageSize]);

  // Combined touch handlers
  const combinedTouchMove = (e) => {
    dragTouchMove(e);
    canvasTouchMove(e);
  };

  const combinedTouchEnd = (e) => {
    dragTouchEnd(e);
    canvasTouchEnd(e);
  };

  return (
    <div 
      className="w-screen h-screen max-h-[100svh] relative overflow-hidden"
      style={{ touchAction: 'none' }}
      onTouchMove={combinedTouchMove}
      onTouchEnd={combinedTouchEnd}
    >
      {/* Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium transition-colors"
      >
        ← Home
      </button>

      {/* Version */}
      <div className="absolute top-4 right-4 z-10 text-sm text-gray-500">
        v.0.0.5
      </div>

      <Toolbar
        onAddShape={addShape}
        onToolbarDragStart={handleToolbarDragStart}
        onToolbarTouchStart={handleToolbarTouchStart}
      />

      <TouchDragPreview
        touchDragType={touchDragType}
        touchDragPosition={touchDragPosition}
      />

      <Canvas
        stageRef={stageRef}
        stageSize={stageSize}
        stageScale={stageScale}
        stageX={stageX}
        stageY={stageY}
        isPanning={isPanning}
        shapes={shapes}
        selectedId={selectedId}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={canvasTouchMove}
        onTouchEnd={canvasTouchEnd}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        onShapeSelect={selectShape}
        onShapePositionUpdate={updateShapePosition}
        onDeleteSelected={deleteSelected}
        connections={connections}
        selectedConnectionId={selectedConnectionId}
        onConnectionSelect={selectConnection}
        onConnectionDelete={deleteSelected}
      />
    </div>
  );
};

export default DiagramView;