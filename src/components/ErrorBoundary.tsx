import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCacheAndReload = () => {
    try {
      // Clear corrupt local state if any, keeping core configuration
      const lang = localStorage.getItem('dailypa_lang');
      localStorage.clear();
      if (lang) localStorage.setItem('dailypa_lang', lang);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                {this.props.fallbackTitle || 'MyDailyPA Notice'}
              </h2>
              <p className="text-sm text-slate-300">
                A temporary display issue occurred. Your data is safe in offline storage.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-300 max-h-28">
                  {this.state.error.message || 'Unknown error'}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCacheAndReload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Clean Cache & Restart</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
