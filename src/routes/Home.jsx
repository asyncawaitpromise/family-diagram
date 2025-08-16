import { useState, useRef } from 'react';
import { Stage, Layer, Circle, Rect, Star, Transformer, Line } from 'react-konva';
import { Plus, Square, Circle as CircleIcon, Star as StarIcon, X } from 'react-feather';

const Home = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [touchDragType, setTouchDragType] = useState(null);
  const [touchDragPosition, setTouchDragPosition] = useState(null);
  const [hasDraggedFromButton, setHasDraggedFromButton] = useState(false);
  const trRef = useRef();
  const stageRef = useRef();

  // Handle window resize
  const handleResize = () => {
    setStageSize({ width: window.innerWidth, height: window.innerHeight });
  };

  // Add shape to canvas
  const addShape = (type, x = null, y = null) => {
    const newShape = {
      id: Date.now().toString(),
      type,
      x: x !== null ? x : Math.random() * (stageSize.width - 100) + 50,
      y: y !== null ? y : Math.random() * (stageSize.height - 100) + 50,
      fill: '#3b82f6',
      draggable: false,
    };
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  // Handle drag start from toolbar
  const handleToolbarDragStart = (type) => {
    setIsDragging(true);
    setDragType(type);
  };

  // Handle drop on canvas
  const handleCanvasDrop = (e) => {
    if (isDragging && dragType) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      addShape(dragType, pointerPosition.x, pointerPosition.y);
      setIsDragging(false);
      setDragType(null);
    }
  };

  // Handle drag over canvas
  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  // Handle touch start on toolbar buttons
  const handleToolbarTouchStart = (type, e) => {
    e.preventDefault();
    setTouchDragType(type);
    setHasDraggedFromButton(false);
    const touch = e.touches[0];
    setTouchDragPosition({ x: touch.clientX, y: touch.clientY });
  };

  // Select shape
  const selectShape = (id) => {
    setSelectedId(id);
  };

  // Handle zoom
  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const scaleBy = 1.02;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    const boundedScale = Math.max(0.1, Math.min(5, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * boundedScale,
      y: pointer.y - mousePointTo.y * boundedScale,
    };

    setStageScale(boundedScale);
    setStageX(newPos.x);
    setStageY(newPos.y);
  };

  // Handle pan start
  const handleMouseDown = (e) => {
    // Check if target has getStage method (is a Konva object)
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setIsPanning(true);
    }
  };

  // Handle pan move
  const handleMouseMove = (e) => {
    if (!isPanning) return;
    
    // Check if target has getStage method (is a Konva object)
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const stage = e.target.getStage();
    setStageX(stage.x());
    setStageY(stage.y());
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Handle touch pan and zoom
  const handleTouchStart = (e) => {
    if (touchDragType) return; // Don't interfere with toolbar drag
    
    // Check if target has getStage method (is a Konva object)
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const stage = e.target.getStage();
    if (e.target !== stage) return; // Only handle touches on empty stage
    
    // Prevent default touch behaviors to avoid page scrolling
    if (e.evt && e.evt.preventDefault) {
      e.evt.preventDefault();
    }
    
    const touches = e.evt && e.evt.touches ? e.evt.touches : [];
    
    if (touches.length === 1) {
      // Single touch - start panning
      setIsPanning(true);
      setSelectedId(null);
    } else if (touches.length === 2) {
      // Two touches - prepare for pinch zoom
      setIsPanning(false);
      const touch1 = touches[0];
      const touch2 = touches[1];
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      stage.setAttrs({ lastDist: dist });
    }
  };

  // Handle touch move for pan and zoom
  const handleTouchMove = (e) => {
    if (touchDragType) {
      // Handle toolbar drag
      e.preventDefault();
      const touch = e.touches[0];
      setTouchDragPosition({ x: touch.clientX, y: touch.clientY });
      setHasDraggedFromButton(true);
      return;
    }

    // Check if target has getStage method (is a Konva object)
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const stage = e.target.getStage();
    if (e.target !== stage) return;
    
    const touches = e.evt && e.evt.touches ? e.evt.touches : [];
    
    if (touches.length === 1 && isPanning) {
      // Single touch panning
      if (e.evt && e.evt.preventDefault) {
        e.evt.preventDefault();
      }
      setStageX(stage.x());
      setStageY(stage.y());
    } else if (touches.length === 2) {
      // Two touch pinch zoom
      if (e.evt && e.evt.preventDefault) {
        e.evt.preventDefault();
      }
      
      const touch1 = touches[0];
      const touch2 = touches[1];
      const newDist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const lastDist = stage.getAttr('lastDist') || newDist;
      
      if (lastDist > 0) {
        const scale = newDist / lastDist;
        const oldScale = stage.scaleX();
        const newScale = Math.max(0.1, Math.min(5, oldScale * scale));
        
        // Get center point of the two touches
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        const stageRect = stage.container().getBoundingClientRect();
        const pointer = {
          x: centerX - stageRect.left,
          y: centerY - stageRect.top
        };
        
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };
        
        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        
        setStageScale(newScale);
        setStageX(newPos.x);
        setStageY(newPos.y);
      }
      
      stage.setAttrs({ lastDist: newDist });
    }
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    if (touchDragType) {
      // Handle toolbar drag end
      e.preventDefault();
      
      // Only create shape from drag if the user actually dragged
      if (hasDraggedFromButton) {
        const stage = stageRef.current;
        const stageRect = stage.container().getBoundingClientRect();
        const touch = e.changedTouches[0];
        
        // Check if touch ended over the stage
        if (
          touch.clientX >= stageRect.left &&
          touch.clientX <= stageRect.right &&
          touch.clientY >= stageRect.top &&
          touch.clientY <= stageRect.bottom
        ) {
          // Convert screen coordinates to stage coordinates
          const localX = (touch.clientX - stageRect.left - stageX) / stageScale;
          const localY = (touch.clientY - stageRect.top - stageY) / stageScale;
          
          addShape(touchDragType, localX, localY);
        }
      }
      
      setTouchDragType(null);
      setTouchDragPosition(null);
      setHasDraggedFromButton(false);
      return;
    }
    
    // Prevent default touch behaviors
    if (isPanning && e.evt && e.evt.preventDefault) {
      e.evt.preventDefault();
    }
    
    setIsPanning(false);
    
    // Check if target has getStage method (is a Konva object)
    if (e.target && typeof e.target.getStage === 'function') {
      const stage = e.target.getStage();
      if (stage) {
        stage.setAttrs({ lastDist: 0 });
      }
    }
  };

  // Deselect when clicking empty area
  const checkDeselect = (e) => {
    // Check if target has getStage method (is a Konva object)
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  // Delete selected shape
  const deleteSelected = () => {
    if (selectedId) {
      setShapes(shapes.filter(shape => shape.id !== selectedId));
      setSelectedId(null);
    }
  };

  // Update shape position
  const updateShapePosition = (id, newPos) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
  };

  // Handle drag move for live updates
  const handleDragMove = (id, newPos) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
  };

  // Render shape based on type
  const renderShape = (shape) => {
    const isSelected = shape.id === selectedId;
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      draggable: isSelected,
      onClick: () => selectShape(shape.id),
      onTap: () => selectShape(shape.id),
      onDragMove: (e) => handleDragMove(shape.id, e.target.position()),
      onDragEnd: (e) => updateShapePosition(shape.id, e.target.position()),
    };

    switch (shape.type) {
      case 'circle':
        return <Circle {...commonProps} radius={30} />;
      case 'rect':
        return <Rect {...commonProps} width={60} height={60} />;
      case 'star':
        return <Star {...commonProps} numPoints={5} innerRadius={20} outerRadius={30} />;
      default:
        return null;
    }
  };

  const selectedShape = shapes.find(shape => shape.id === selectedId);

  return (
    <div 
      className="w-screen h-screen max-h-[100svh] relative overflow-hidden"
      style={{ touchAction: 'none' }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toolbar */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-base-100 shadow-lg rounded-lg p-2 flex gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('circle')}
          draggable
          onDragStart={() => handleToolbarDragStart('circle')}
          onTouchStart={(e) => handleToolbarTouchStart('circle', e)}
        >
          <CircleIcon size={16} />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('rect')}
          draggable
          onDragStart={() => handleToolbarDragStart('rect')}
          onTouchStart={(e) => handleToolbarTouchStart('rect', e)}
        >
          <Square size={16} />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('star')}
          draggable
          onDragStart={() => handleToolbarDragStart('star')}
          onTouchStart={(e) => handleToolbarTouchStart('star', e)}
        >
          <StarIcon size={16} />
        </button>
      </div>

      {/* Touch drag preview */}
      {touchDragType && touchDragPosition && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: touchDragPosition.x - 20,
            top: touchDragPosition.y - 20,
            width: 40,
            height: 40,
            backgroundColor: '#3b82f6',
            borderRadius: touchDragType === 'circle' ? '50%' : touchDragType === 'rect' ? '0%' : '50%',
            opacity: 0.7,
          }}
        >
          {touchDragType === 'star' && (
            <div className="w-full h-full flex items-center justify-center text-white">★</div>
          )}
        </div>
      )}

      {/* Canvas */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        draggable={true}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
      >
        <Layer>
          {shapes.map(renderShape)}
          
          {/* Selection border and delete button */}
          {selectedShape && (
            <>
              <Rect
                x={selectedShape.type === 'rect' ? selectedShape.x - 5 : selectedShape.x - 35}
                y={selectedShape.type === 'rect' ? selectedShape.y - 5 : selectedShape.y - 35}
                width={selectedShape.type === 'rect' ? 70 : 70}
                height={selectedShape.type === 'rect' ? 70 : 70}
                stroke="#ef4444"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
                listening={false}
              />
              <Circle
                x={selectedShape.type === 'rect' ? selectedShape.x + 65 : selectedShape.x + 35}
                y={selectedShape.type === 'rect' ? selectedShape.y - 5 : selectedShape.y - 35}
                radius={12}
                fill="#ef4444"
                stroke="white"
                strokeWidth={2}
                onClick={deleteSelected}
                onTap={deleteSelected}
              />
              <Line
                points={[
                  (selectedShape.type === 'rect' ? selectedShape.x + 65 : selectedShape.x + 35) - 6, 
                  (selectedShape.type === 'rect' ? selectedShape.y - 5 : selectedShape.y - 35) - 6,
                  (selectedShape.type === 'rect' ? selectedShape.x + 65 : selectedShape.x + 35) + 6, 
                  (selectedShape.type === 'rect' ? selectedShape.y - 5 : selectedShape.y - 35) + 6
                ]}
                stroke="white"
                strokeWidth={2}
                listening={false}
              />
              <Line
                points={[
                  (selectedShape.type === 'rect' ? selectedShape.x + 65 : selectedShape.x + 35) + 6, 
                  (selectedShape.type === 'rect' ? selectedShape.y - 5 : selectedShape.y - 35) - 6,
                  (selectedShape.type === 'rect' ? selectedShape.x + 65 : selectedShape.x + 35) - 6, 
                  (selectedShape.type === 'rect' ? selectedShape.y - 5 : selectedShape.y - 35) + 6
                ]}
                stroke="white"
                strokeWidth={2}
                listening={false}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Home;