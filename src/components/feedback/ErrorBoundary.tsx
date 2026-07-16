import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-safety-red/10 mb-4">
            <AlertTriangle className="w-8 h-8 text-safety-red" />
          </div>
          <h3 className="text-sm font-medium text-safety-text mb-1">Something went wrong</h3>
          <p className="text-xs text-safety-muted max-w-xs">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => this.setState({ hasError: false, error: undefined })} className="mt-4 px-4 py-2 bg-safety-cyan/20 border border-safety-cyan/30 text-safety-cyan rounded-lg text-sm hover:bg-safety-cyan/30 transition-colors">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
