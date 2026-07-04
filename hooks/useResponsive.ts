import { useWindowDimensions } from "react-native";

export interface ResponsiveInfo {
  width: number;
  isTablet: boolean;
  columns: number;
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