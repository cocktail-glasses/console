import { Component, ComponentType, isValidElement, ReactElement, ReactNode } from 'react';

// import { eventAction, HeadlampEventType } from 'redux/headlampEventSlice';
// import store from 'redux/stores/store';

export interface ErrorBoundaryProps {
  fallback?: ReactElement<{ error: Error }> | ComponentType<{ error: Error }>;
  children?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Stop errors in some components from breaking the whole app.
 *
 * > A JavaScript error in a part of the UI shouldn’t break the whole app.
 * > To solve this problem for React users, React 16 introduces a new concept
 * > of an “error boundary”.
 *
 * @see https://reactjs.org/docs/error-boundaries.html
 *
 * @example
 * ```tsx
 * <ErrorBoundary><p>this might fail</p></ErrorBoundary>
 *
 * <ErrorBoundary
 *   key={someName}
 *   fallback={({error}) => {
 *     return <div>An error has occurred: {error}</div>;
 *   }}
 * >
 *   <p>a component that might fail</p>
 * </ErrorBoundary>
 *
 * <ErrorBoundary fallback={<p>a fallback</p>}><p>this might fail</p></ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error | null) {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ error: null });
    }
    // if (prevState.error !== this.state.error && this.state.error) {
    //   store.dispatch(
    //     eventAction({ type: HeadlampEventType.ERROR_BOUNDARY, data: this.state.error })
    //   );
    // }
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    const FallbackComponent = this.props.fallback;
    if (isValidElement(FallbackComponent)) {
      return FallbackComponent;
    }

    return FallbackComponent ? <FallbackComponent error={error} /> : null;
  }
}
