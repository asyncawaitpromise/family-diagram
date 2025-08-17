import { Rect } from 'react-konva';
import { useInteractionStore } from '../stores/interactionStore';
import { CANVAS_CONFIG } from '../constants/canvas';

const AreaSelectionRect = () => {
  const { isAreaSelecting, areaSelectionStart, areaSelectionEnd } = useInteractionStore();

  if (!isAreaSelecting || !areaSelectionStart || !areaSelectionEnd) {
    return null;
  }

  const x = Math.min(areaSelectionStart.x, areaSelectionEnd.x);
  const y = Math.min(areaSelectionStart.y, areaSelectionEnd.y);
  const width = Math.abs(areaSelectionEnd.x - areaSelectionStart.x);
  const height = Math.abs(areaSelectionEnd.y - areaSelectionStart.y);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke={CANVAS_CONFIG.SELECTION.BORDER_COLOR}
      strokeWidth={CANVAS_CONFIG.SELECTION.BORDER_WIDTH}
      dash={CANVAS_CONFIG.SELECTION.BORDER_DASH}
      fill="rgba(0, 123, 255, 0.1)"
      listening={false}
    />
  );
};

export default AreaSelectionRect;