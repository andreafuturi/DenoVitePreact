// HOC for interactive components
const withInteractivity = WrappedComponent => {
  // Check if we're on the server
  const isServer = typeof window === "undefined";

  // Return original component if not on server
  if (!isServer) {
    return WrappedComponent;
  }

  const WithInteractive = props => {
    // Generate a unique ID combining component name and a timestamp
    const uniqueId = `${WrappedComponent.name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const serializedProps = JSON.stringify(props);

    return (
      <>
        <interactive id={uniqueId} data-component={WrappedComponent.name.toLowerCase()} props={serializedProps}>
          <WrappedComponent {...props} />
        </interactive>
      </>
    );
  };

  // Preserve the original component name
  WithInteractive.displayName = WrappedComponent.name;

  return WithInteractive;
};
export default withInteractivity;
