import "../styles/components/Loading.scss";
import Card from "./Card.tsx";

interface LoadingProps {
  type?: string;
  spinnerText?: string;
  loadingText?: string;
}

const Loading = ({
  type = "loading-more",
  spinnerText,
  loadingText,
}: LoadingProps) => {
  return (
    <>
      {type === "loading-more" && (
        <div className={"loading-component"} data-testid={"loading-component"}>
          Loading more movies...
        </div>
      )}
      {type === "loading-state" && (
        <div className="movie-details-loading">
          <Card>
            <div className="loading-spinner">
              <div>{spinnerText}</div>
            </div>
            <p className="loading-text">{loadingText}</p>
          </Card>
        </div>
      )}
    </>
  );
};

export default Loading;
