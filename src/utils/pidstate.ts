/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavItem, NavItems } from './config';
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

export const initialPIDState: PIDState = {
  originalX: 0,
  originalY: 0,
  previousErrorX: 0,
  previousErrorY: 0,
  setPointX: 0,
  setPointY: 0,
  integralX: 0,
  integralY: 0,
};

export const PIDStateMap = new Map<string, PIDState>(
  NavItems.map((item) => [item.ariaLabel, { ...initialPIDState }]),
);

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
  state: PIDState,
  config: any,
  element: HTMLElement,
) => {
  const now = performance.now();
  state.lastTime = state.lastTime ? state.lastTime : now;
  const dt = (now - state.lastTime) / 1000;

  const errorX = event.clientX - state.setPointX;
  const errorY = event.clientY - state.setPointY;

  const KpScaled = config.Kp * errorX;
  const KiScaled = config.Ki * errorY;
  const KdScaled = config.Kd;

  const proportionalX = KpScaled * errorX;
  const proportionalY = KpScaled * errorY;
  state.integralX += config.Ki * errorX * dt;
  state.integralY += config.Ki * errorY * dt;

  const derivativeX = config.Kd * ((errorX - state.previousErrorX) / dt);
  const derivativeY = config.Kd * ((errorY - state.previousErrorY) / dt);

  const dx = proportionalX + state.integralX + derivativeX;
  const dy = proportionalY + state.integralY + derivativeY;

  state.previousErrorX = errorX;
  state.previousErrorY = errorY;
  state.setPointX += dx;
  state.setPointY += dy;
  element.style.transform = `translate(${state.setPointX}px, ${state.setPointY}px) scale(1.1)`;

  return state;
};
