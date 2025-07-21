import { IconProps } from "../../types.ts";

const StarIcon = ({color = 'gray', size = 24, strokeWidth = 2}: IconProps) => {
  return (
    <svg
      aria-label="star-icon"
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
      <polygon points="12 2 15 8.6 22 9.2 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.2 9 8.6 12 2" />
    </svg>
  );
}

export default StarIcon;
