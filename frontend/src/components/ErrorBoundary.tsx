import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <div style={{
            maxWidth: 580,
            width: '100%',
            background: 'var(--surface-elevated, #111832)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 16,
            padding: '32px 28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: 14,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              marginBottom: 16
            }}>
              <AlertTriangle size={36} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>
              {this.props.fallbackTitle || 'Grid Intelligence Module Encountered an Issue'}
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              An unexpected render anomaly occurred. Your session state and local telemetry remain intact.
            </p>

            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '12px 14px',
                borderRadius: 8,
                fontSize: '0.78rem',
                color: '#fda4af',
                overflowX: 'auto',
                marginBottom: 24,
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {this.state.error.message}
              </pre>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <RefreshCw size={15} />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Home size={15} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
