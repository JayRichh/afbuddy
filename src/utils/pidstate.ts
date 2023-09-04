/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavItem } from './config';
import { calculateDistance } from './calculations';

export interface PIDState {
  [x: string]: number;
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

export interface PIDStateBase {
  [x: string]: number;
  originalX: number;
  originalY: number;
  previousErrorX: number;
  previousErrorY: number;
  setPointX: number;
  setPointY: number;
  integralX: number;
  integralY: number;
}

export const calculatePID = (
  event: MouseEvent,
  item: NavItem | string,
  state: PIDState,
  config: any,
  icon: HTMLElement,
) => {
  const now = performance.now();
  state.lastTime = state.lastTime ? state.lastTime : performance.now();
  const dt = (now - state.lastTime) / 1000;

  const errorX = event.clientX - state.setPointX;
  const errorY = event.clientY - state.setPointY;

  const KpScaled = config.Kp * errorX;
  const KiScaled = config.Ki * errorY;
  const KdScaled = config.Kd;

  const proportionalX = KpScaled * errorX;
  const proportionalY = KpScaled * errorY;
  state.integralX += KiScaled * errorX * dt;
  state.integralY += KiScaled * errorY * dt;
  const derivativeX = (KdScaled * (errorX - state.previousErrorX)) / dt;
  const derivativeY = (KdScaled * (errorY - state.previousErrorY)) / dt;

  const dx = proportionalX + state.integralX + derivativeX;
  const dy = proportionalY + state.integralY + derivativeY;

  state.previousErrorX = errorX;
  state.previousErrorY = errorY;
  state.setPointX += dx;
  state.setPointY += dy;
  icon.style.transform = `translate(${state.setPointX}px, ${state.setPointY}px) scale(1.1)`;

  return state;
};
