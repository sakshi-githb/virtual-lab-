import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white border-4 border-charcoal p-8 max-w-lg shadow-brutal-xl">
            <h1 className="text-2xl font-black uppercase text-brutalRed mb-4">Laboratory Interface Error</h1>
            <p className="text-sm font-mono text-charcoal mb-4">
              An unexpected initialization error occurred:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs text-left overflow-x-auto text-red-600 font-mono mb-6">
              {this.state.error ? this.state.error.toString() : 'Unknown Error'}
            </pre>
            <button
              onClick={() => { window.location.href = '/physicslab'; }}
              className="btn-brutal bg-brutalYellow text-charcoal px-6 py-2.5 font-black uppercase text-xs cursor-pointer"
            >
              Return to Physics Lab Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
