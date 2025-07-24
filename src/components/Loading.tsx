const Loading = () => {
  return (
    <div
      data-testid={'loading-component'}
      style={{
        minWidth: 220,
        maxWidth: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading more movies...
    </div>
  )
}

export default Loading;
