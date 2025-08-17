import { useRef, useEffect } from 'react';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import TouchDragPreview from '../components/TouchDragPreview';
import { useCanvasStore } from '../stores/canvasStore';
import { usePersistedShapeStore } from '../stores/persistedShapeStore';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';
import { useDragDropInteractions } from '../hooks/useDragDropInteractions';

const Home = () => {
  const stageRef = useRef();

  // Zustand stores
  const { stageScale, stageX, stageY, stageSize, isPanning, setStageSize } = useCanvasStore();
  const { shapes, selectedId, addShape, selectShape, deleteSelected, updateShapePosition } = usePersistedShapeStore();

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
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        onShapeSelect={selectShape}
        onShapePositionUpdate={updateShapePosition}
        onDeleteSelected={deleteSelected}
      />
    </div>
  );
};

export default Home;