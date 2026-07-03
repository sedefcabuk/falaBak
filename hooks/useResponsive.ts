import { useWindowDimensions } from "react-native";

export interface ResponsiveInfo {
  width: number;
  isTablet: boolean;
  /** Column count for the Fal Türlerimiz grid. */
  columns: number;
  /** Caps content width on large screens so it doesn't stretch edge-to-edge. */
  contentMaxWidth: number;
  horizontalPadding: number;
}

export function useResponsive(): ResponsiveInfo {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return {
    width,
    isTablet,
    columns: isTablet ? 4 : 3,
    contentMaxWidth: isTablet ? 560 : width,
    horizontalPadding: isTablet ? 32 : 24,
  };
}