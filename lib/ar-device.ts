export function canUseKitchenAR() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const phoneOrTablet =
    iPadOS ||
    /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua) ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cameraApi =
    typeof navigator.mediaDevices?.getUserMedia === "function";

  return cameraApi && phoneOrTablet && (!desktopPointer || iPadOS);
}
