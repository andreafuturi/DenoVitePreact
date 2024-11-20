// HOC for interactive components
const withInteractivity = WrappedComponent => {
  // Check if we're on the server
  const isServer = typeof window === "undefined";

  // Return original component if not on server
  if (!isServer) {
    return WrappedComponent;
  }

  const WithInteractive = props => {
    // Serialize props for client-side hydration
    const serializedProps = JSON.stringify(props);
    //we might need to add a unique id to the interactive component to avoid conflicts when multiple components are hydrated at the same time

    return (
      <>
        <interactive id={WrappedComponent.name.toLowerCase()} props={serializedProps}>
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
