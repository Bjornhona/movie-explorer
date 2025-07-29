import "../styles/components/Loading.scss";
import Card from "./Card.tsx";

interface LoadingProps {
  type: string;
}

const Loading = ({ type = "loading-more" }: LoadingProps) => {
  return (
    <>
      {type === "loading-more" && (
        <div className={"loading-component"} data-testid={"loading-component"}>
          Loading more movies...
        </div>
      )}
      {type === "loading-movie-details" && (
        <div className="movie-details-page">
          <Card>
            <div className="loading-spinner">
              <div>Loading movie details...</div>
            </div>
            <p className="loading-text">
              Please wait while we fetch the movie information
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default Loading;
