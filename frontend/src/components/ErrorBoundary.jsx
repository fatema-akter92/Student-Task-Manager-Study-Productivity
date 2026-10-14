import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Card from './Card';

/**
 * Error Boundary component catching JavaScript errors anywhere in child component tree.
 * Displays a friendly fallback UI as specified in project bonus criteria.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card
          className="border-rose-500/30 bg-rose-950/20 my-6 text-center py-8"
          title="Something went wrong"
          icon={<AlertTriangle className="w-6 h-6 text-rose-500" />}
        >
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <p className="text-slate-300 text-sm max-w-md">
              We encountered an unexpected error while displaying this section. Your tasks are safely preserved in the database.
            </p>
            {this.state.error?.message && (
              <pre className="text-xs bg-slate-900/80 text-rose-300 p-3 rounded-lg max-w-md overflow-x-auto text-left font-mono border border-rose-500/20">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/30"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
