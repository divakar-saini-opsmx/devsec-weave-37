import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and configure your AI Guardian experience
        </p>
      </div>

      <Separator />

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-muted-foreground">
                Choose between light and dark mode. Currently using <span className="capitalize font-medium">{theme}</span> theme.
              </div>
            </div>
            <ThemeSwitch variant="toggle" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Configure security and scanning preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Security settings will be available in a future update.
          </div>
        </CardContent>
      </Card> */}

      {/* Notifications */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Notification settings will be available in a future update.
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}