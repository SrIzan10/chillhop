import { readable } from 'svelte/store';
import { browser } from '$app/environment';
export function useIsMobile(mobileWidth = 768) {
  return readable(false, (set) => {
    if (!browser) return;
    
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < mobileWidth;
      set(isMobile);
    };
    
    checkIsMobile();
    
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  });
}