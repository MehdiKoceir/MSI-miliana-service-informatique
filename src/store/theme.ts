import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Black & Gold is the default
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        
        // Side effect: update class on html key
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (nextTheme === 'light') {
            root.classList.add('light-theme');
          } else {
            root.classList.remove('light-theme');
          }
        }
      },
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (theme === 'light') {
            root.classList.add('light-theme');
          } else {
            root.classList.remove('light-theme');
          }
        }
      }
    }),
    {
      name: 'msi-theme-storage',
    }
  )
);
