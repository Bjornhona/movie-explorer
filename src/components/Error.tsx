import Card from "./Card.tsx";
import Button from "./Button.tsx";

interface ErrorProps {
  icon: string;
  title: string;
  error: string;
  buttonText: string;
  buttonOnClick: () => void;
  buttonType?: "primary" | "secondary";
}

const Error = ({
  icon,
  title,
  error,
  buttonText,
  buttonOnClick,
  buttonType,
}: ErrorProps) => {
  return (
    <Card icon={icon} title={title}>
      <p className="error-description">{error}</p>
      <Button
        text={buttonText}
        onClick={buttonOnClick}
        type={buttonType ? buttonType : "primary"}
      />
    </Card>
  );
};

export default Error;
