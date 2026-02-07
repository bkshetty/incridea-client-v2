// src/utils/pronite.ts

export const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
};

export const clamp = (val: number, min: number, max: number): number => {
    return Math.min(Math.max(val, min), max);
};

export const mapRange = (
    value: number, 
    inMin: number, 
    inMax: number, 
    outMin: number, 
    outMax: number
): number => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

export const isTouchDevice = (): boolean => {
    return window.matchMedia('(pointer: coarse)').matches;
};