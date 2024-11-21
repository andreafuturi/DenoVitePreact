/**
 * Marks components that shouldn't be hydrated 🚫
 * @param {{ children: any }} props
 */
export function ServerOnly({ children }) {
  return <no-hydration data-server-only>{children}</no-hydration>;
}

/**
 * HOC to prevent component hydration 🛡️
 */
export const withoutHydration = WrappedComponent => {
  const WithoutHydration = props => {
    return (
      <ServerOnly>
        <WrappedComponent {...props} />
      </ServerOnly>
    );
  };
  WithoutHydration.displayName = `WithoutHydration(${WrappedComponent.name})`;
  return WithoutHydration;
};
