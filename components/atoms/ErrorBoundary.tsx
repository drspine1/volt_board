"use client";
import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props { children: ReactNode; label?: string; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
          <AlertTriangle size={20} className="text-red-500" />
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {this.props.label ?? "Something went wrong"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs text-red-500 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
