export const ensureTooltipVisibility = (tooltip: HTMLElement) => {
  let parent: HTMLElement | null = tooltip.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    if (style.overflow === "hidden") {
      parent.style.overflow = "visible";
    }
    parent = parent.parentElement;
  }
};

export function showTooltipOnHover(
  event: MouseEvent,
  tooltipText: string,
  tooltip: {
    tooltipText: string;
    showTooltip: boolean;
    tooltipX: number;
    tooltipY: number;
  }
): void {
  const target = event.target as HTMLElement;
  tooltip.tooltipText = tooltipText;
  tooltip.showTooltip = true;
  tooltip.tooltipX =
    target.getBoundingClientRect().left + target.offsetWidth + 10;
  tooltip.tooltipY =
    target.getBoundingClientRect().top + target.offsetHeight / 2;
}
