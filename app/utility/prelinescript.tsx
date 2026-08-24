'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

import { IStaticMethods } from 'preline/preline';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export default function PrelineScript() {
  const path = usePathname();

  useLayoutEffect(() => {
    const loadPreline = async () => {
      try {
        // Dynamically import Preline
        await import('preline/preline');

        // Make sure HSStaticMethods is available
        if (window?.HSStaticMethods?.autoInit) {
          // Delay the autoInit until the DOM is fully ready
          setTimeout(() => {
            const interval = setInterval(() => {
              // Check if the DOM elements are ready
              const elements = document.querySelectorAll('[data-hs-tab]');
              if (elements.length > 0) {
                window.HSStaticMethods.autoInit(); // Initialize Preline
                clearInterval(interval); // Stop the interval once the elements are ready
              }
            }, 100); // Check every 100ms for the elements
          }, 200); // Extra delay to give more time for rendering
        } else {
          console.warn('HSStaticMethods or autoInit is not available.');
        }
      } catch (error) {
        console.error('Error loading Preline:', error);
      }
    };

    loadPreline();
  }, [path]); // Re-run on path change

  return null;
}
