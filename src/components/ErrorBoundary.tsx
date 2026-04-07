import React, { useState, useEffect, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  if (hasError) {
    let errorMessage = "An unexpected system failure occurred.";
    let isFirestoreError = false;

    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.error && parsed.operationType) {
        errorMessage = `Mainframe Access Denied: ${parsed.operationType.toUpperCase()} operation failed. Check your security clearance.`;
        isFirestoreError = true;
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass border-red-500/50 p-8 rounded-2xl space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-mono text-white uppercase tracking-widest">Critical System Fault</h2>
          <p className="text-sm text-white/60 font-mono leading-relaxed">
            {errorMessage}
          </p>
          {isFirestoreError && (
            <p className="text-[10px] text-red-400/50 font-mono uppercase">
              Error Code: SEC_AUTH_FAILURE_403
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-500 rounded-lg transition-all font-mono text-xs uppercase"
          >
            <RefreshCw className="w-4 h-4" />
            Reboot Mainframe
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
