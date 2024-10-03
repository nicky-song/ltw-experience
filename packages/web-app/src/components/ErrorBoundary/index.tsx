import { Component } from 'react';
import { Button, Result } from 'antd';

export class ErrorBoundary extends Component<
  { fallback?: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback ?? (
          <Result
            status='error'
            title='Something went wrong'
            extra={
              <>
                <Button
                  key='retry'
                  type='primary'
                  onClick={() => this.setState({ hasError: false })}>
                  Try Again
                </Button>
                <Button href='https://learntowin.zendesk.com/hc/en-us'>
                  Help
                </Button>
              </>
            }
          />
        )
      );
    }

    return this.props.children;
  }
}
