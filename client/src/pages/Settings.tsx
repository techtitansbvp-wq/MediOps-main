import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Key, Bell, User } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Your personal account details managed by Replit Auth.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Admin</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <div className="mt-1 p-3 bg-muted/50 rounded-lg text-sm border">
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="mt-1 p-3 bg-muted/50 rounded-lg text-sm border">
                {user?.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-4 h-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Two-factor Authentication</div>
                <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
              </div>
              <Button variant="outline" size="sm" disabled>Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Session Management</div>
                <div className="text-xs text-muted-foreground">Log out of other devices</div>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Email Alerts</div>
                <div className="text-xs text-muted-foreground">Receive daily summaries</div>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">System Updates</div>
                <div className="text-xs text-muted-foreground">Important security patches</div>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
