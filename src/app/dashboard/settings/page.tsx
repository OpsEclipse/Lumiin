import { DashboardHeader } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage(): React.ReactElement {
  return (
    <>
      <DashboardHeader title="Settings" />
      <div className="p-8 space-y-8 max-w-2xl">
        {/* Account Settings */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-widest font-light">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
                Display Name
              </label>
              <Input placeholder="Your name" className="max-w-sm" />
            </div>
            <div>
              <label className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
                Email
              </label>
              <Input placeholder="you@example.com" className="max-w-sm" disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Email is managed through your authentication provider
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-widest font-light">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Notification preferences will be available in a future update.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Danger Zone */}
        <Card className="border border-destructive/50 bg-card">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-widest font-light text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
