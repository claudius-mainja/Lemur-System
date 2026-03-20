'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function ClearCachePage() {
  const router = useRouter();
  const { logout, clearAuth } = useAuthStore();
  const [status, setStatus] = useState<'clearing' | 'complete' | 'error'>('clearing');

  useEffect(() => {
    const clearAllData = async () => {
      try {
        // 1. Clear localStorage - all app data
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }

        // 2. Clear sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.clear();
        }

        // 3. Clear Zustand auth store
        clearAuth();

        // 4. Additional cleanup - clear any cached data
        if (typeof window !== 'undefined') {
          // Clear IndexedDB if exists
          const databases = await window.indexedDB.databases();
          for (const db of databases) {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name);
            }
          }
        }

        setStatus('complete');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Error clearing cache:', error);
        setStatus('error');
      }
    };

    clearAllData();
  }, [router, clearAuth]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md text-center">
        {status === 'clearing' && (
          <>
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Clearing Cache & Data</h2>
            <p className="text-slate-400">Please wait while we clear all stored data...</p>
          </>
        )}

        {status === 'complete' && (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Cache Cleared Successfully</h2>
            <p className="text-slate-400">All data has been cleared. Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Error Clearing Cache</h2>
            <p className="text-slate-400">Something went wrong. Please try again.</p>
          </>
        )}
      </div>
    </div>
  );
}