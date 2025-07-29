import '../styles/components/Button.scss';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
  type?: 'primary' | 'secondary';
}

const Button = ({onClick, disabled = false, text = 'OK', type = 'primary'}: ButtonProps) => {
  return (
    <button
      className={`button ${type && type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
