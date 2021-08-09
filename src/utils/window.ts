export const isFullScreen = (): boolean => {
  return screen.width == window.outerWidth && screen.height == window.outerHeight
}
