import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeSwitchProps {
  variant?: 'icon' | 'toggle';
  size?: 'sm' | 'default' | 'lg';
}

export function ThemeSwitch({ variant = 'icon', size = 'default' }: ThemeSwitchProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="transition-smooth hover:bg-muted"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      className="transition-smooth gap-2"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4" />
          Switch to Dark
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          Switch to Light
        </>
      )}
    </Button>
  );
}