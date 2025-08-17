import { Stage, Layer } from 'react-konva';
import { useState } from 'react';
import Shape from './Shape';
import SelectionBorder from './SelectionBorder';

const Canvas = ({
  stageRef,
  stageSize,
  stageScale,
  stageX,
  stageY,
  isPanning,
  shapes,
  selectedId,
  onStageMove,
  onStageEnd,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onDrop,
  onDragOver,
  onShapeSelect,
  onShapePositionUpdate,
  onDeleteSelected
}) => {
  const selectedShape = shapes.find(shape => shape.id === selectedId);
  const [selectedShapeDragPosition, setSelectedShapeDragPosition] = useState(null);

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
      draggable={false}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Layer>
        {shapes.map(shape => (
          <Shape
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={onShapeSelect}
            onPositionUpdate={onShapePositionUpdate}
            onDragMove={shape.id === selectedId ? setSelectedShapeDragPosition : undefined}
          />
        ))}
        
        {selectedShape && (
          <SelectionBorder
            shape={selectedShape}
            dragPosition={selectedShapeDragPosition}
            onDelete={onDeleteSelected}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;