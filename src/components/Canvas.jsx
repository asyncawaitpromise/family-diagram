import { Stage, Layer } from 'react-konva';
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

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
      draggable={isPanning}
      onDragMove={onStageMove}
      onDragEnd={onStageEnd}
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
          />
        ))}
        
        {selectedShape && (
          <SelectionBorder
            shape={selectedShape}
            onDelete={onDeleteSelected}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;