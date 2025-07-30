import Card from "./Card.tsx";
import Button from "./Button.tsx";

interface ErrorProps {
  icon?: string;
  title?: string;
  error?: string;
  buttonText?: string;
  buttonOnClick?: () => void;
  buttonType?: "primary" | "secondary";
}

const Error = ({
  icon = '⚠️',
  title = 'Error',
  error = 'An error has occured',
  buttonText = 'OK',
  buttonOnClick,
  buttonType = 'primary',
}: ErrorProps) => {
  return (
    <Card icon={icon} title={title}>
      <p className="error-description">{error}</p>
      {buttonOnClick && <Button
        text={buttonText}
        onClick={buttonOnClick}
        type={buttonType}
      />}
    </Card>
  );
};

export default Error;
