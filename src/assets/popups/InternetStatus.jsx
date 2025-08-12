import React, { useEffect, useState } from 'react';
import { FiWifi, FiWifiOff, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const ConnectionError = ({ 
  onRetry, 
  retryText = 'Retry', 
  customMessage, 
  showIcon = true,
  className = '',
  autoRetry = false,
  retryInterval = 5000
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    // window.addEventListener('offline', handleOnline);

    let retryTimer;

    if (autoRetry && !isOnline) {
      retryTimer = setInterval(() => {
        setIsRetrying(true);
        onRetry?.();
        setTimeout(() => setIsRetrying(false), 1000);
      }, retryInterval);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      // window.removeEventListener('offline', handleOffline);
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [isOnline, autoRetry, retryInterval, onRetry]);

  if (isOnline) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        {showIcon && (
          <div className="flex justify-center mb-4 relative">
            <div className="relative">
              <FiWifiOff className="w-12 h-12 text-blue-900" />
              <FiAlertTriangle className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500" />
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-center text-black mb-2">
          Connection Lost
        </h3>

        <p className="text-gray-800 text-center mb-6">
          {customMessage ||
            'You are currently offline. Please check your internet connection.'}
        </p>

        <div className="flex justify-center">
          {onRetry && (
            <button
              onClick={() => {
                setIsRetrying(true);
                onRetry();
                setTimeout(() => setIsRetrying(false), 1000);
              }}
              disabled={isRetrying}
              className={`flex items-center px-4 py-2 rounded-md ${
                isRetrying
                  ? 'bg-blue-700 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800'
              } text-white transition-colors`}
              aria-label="Retry connection"
            >
              {isRetrying ? (
                <>
                  <FiRefreshCw className="animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  {retryText}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionError;