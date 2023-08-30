import { NavItem, calculateDistance } from './config';

export interface PIDState {
  originalX: number;
  originalY: number;
  previousErrorX: number;
  previousErrorY: number;
  setPointX: number;
  setPointY: number;
  integralX: number;
  integralY: number;
}

export const PIDStateMap = new Map<string, PIDState>();

export const calculatePID = (
  event: MouseEvent,
  item: NavItem | string,
  state: PIDState,
  config: any,
  icon: HTMLElement,
) => {
  const ariaLabel = typeof item === 'string' ? item : item.ariaLabel;
  const rect = icon.getBoundingClientRect();
  let errorX = event.clientX - rect.left - rect.width / 2;
  let errorY = event.clientY - rect.top - rect.height / 2;
  const distance = calculateDistance(errorX, errorY, 0, 0);

  if (!state) {
    state = {
      integralX: 0,
      integralY: 0,
      previousErrorX: 0,
      previousErrorY: 0,
      originalX: rect.left + rect.width / 2,
      originalY: rect.top + rect.height / 2,
      setPointX: rect.left + rect.width / 2,
      setPointY: rect.top + rect.height / 2,
    };
    PIDStateMap.set(ariaLabel, state);
  }

  const detachThreshold = config.maxDetachDistance;
  const maxDetachDistance = config.maxDetachDistance;
  const maxMovement = config.maxMovement;
  const Kp = config.Kp;
  const Ki = config.Ki;
  const Kd = config.Kd;

  if (distance > detachThreshold) {
    errorX = state.setPointX - rect.left - rect.width / 2;
    errorY = state.setPointY - rect.top - rect.height / 2;
  }

  if (distance > maxDetachDistance) {
    state.setPointX = state.originalX;
    state.setPointY = state.originalY;
    icon.style.transform = `translate(${state.originalX}px, ${state.originalY}px) scale(1)`;
    return state;
  }

  const KpScaled = Kp * (distance / maxDetachDistance);
  const KiScaled = Ki * (distance / maxDetachDistance);
  const KdScaled = Kd * (distance / maxDetachDistance);

  if (Math.abs(errorX) > maxMovement || Math.abs(errorY) > maxMovement) {
    state.setPointX = state.originalX;
    state.setPointY = state.originalY;
    icon.style.transform = `translate(${state.originalX}px, ${state.originalY}px) scale(1)`;
    return state;
  }

  const proportionalX = KpScaled * errorX;
  const proportionalY = KpScaled * errorY;
  state.integralX += KiScaled * errorX;
  state.integralY += KiScaled * errorY;
  const derivativeX = KdScaled * (errorX - state.previousErrorX);
  const derivativeY = KdScaled * (errorY - state.previousErrorY);
  const dx = proportionalX + state.integralX + derivativeX;
  const dy = proportionalY + state.integralY + derivativeY;

  state.previousErrorX = errorX;
  state.previousErrorY = errorY;
  state.setPointX += dx;
  state.setPointY += dy;
  icon.style.transform = `translate(${state.setPointX}px, ${state.setPointY}px) scale(1.1)`;

  return state;
};
