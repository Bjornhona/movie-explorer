import { IconProps } from "../../types.ts";

const BookmarkIcon = ({ color = 'purple', size = 24, strokeWidth = 2 }: IconProps) => {
  return (
    <svg
      aria-label="bookmark-icon"
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
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-5-7 5V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export default BookmarkIcon;
