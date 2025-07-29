import Card from "./Card.tsx";
import Button from './Button.tsx';

interface ErrorProps {
  icon: string;
  title: string;
  error: string;
  buttonText: string;
  buttonOnClick: () => void;
}

const Error = ({icon, title, error, buttonText, buttonOnClick}: ErrorProps) => {
  return (
    <Card icon={icon} title={title}>
    {/* // <div className="movie-details-page">
    //   <div className="movie-error fade-in">
    //     <div className="card-content"> */}
          {/* <div className="error-icon">{icon}</div>
          <h3 className="error-title">{title}</h3> */}
          <p className="error-description">{error}</p>
          <Button text={buttonText} onClick={buttonOnClick} />
          {/* <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button> */}
    {/* //     </div>
    //   </div>
    // </div> */}
    </Card>
  );
};

export default Error;
