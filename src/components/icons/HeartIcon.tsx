import { IconProps } from "../../types.ts";

const HeartIcon = ({color = 'gray', size = 24, strokeWidth = 2}: IconProps) => {
  return (
    <svg
      aria-label="heart-icon"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6c-1.6-1.4-4-1.4-5.6 0L12 7.2 8.8 4.6c-1.6-1.4-4-1.4-5.6 0-1.8 1.6-1.8 4.4 0 6l8.8 8.4 8.8-8.4c1.8-1.6 1.8-4.4 0-6z" />
    </svg>
  );
}

export default HeartIcon;
