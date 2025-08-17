const TouchDragPreview = ({ touchDragType, touchDragPosition }) => {
  if (!touchDragType || !touchDragPosition) return null;

  const getBorderRadius = () => {
    switch (touchDragType) {
      case 'circle': return '50%';
      case 'rect': return '0%';
      case 'star': return '50%';
      default: return '50%';
    }
  };

  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: touchDragPosition.x - 20,
        top: touchDragPosition.y - 20,
        width: 40,
        height: 40,
        backgroundColor: '#3b82f6',
        borderRadius: getBorderRadius(),
        opacity: 0.7,
      }}
    >
      {touchDragType === 'star' && (
        <div className="w-full h-full flex items-center justify-center text-white">★</div>
      )}
    </div>
  );
};

export default TouchDragPreview;