
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updatePasswordSetting } from './passwordActions'; // Updated path
import { Loader2, Settings } from 'lucide-react';

export function PasswordSettingsForm({ isEnabled: initialIsEnabled }: { isEnabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(initialIsEnabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updatePasswordSetting(isEnabled);
      toast({
        title: 'Setting Updated',
        description: `Password requirement has been ${isEnabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the password setting.',
      });
      // Revert switch if update fails
      setIsEnabled(!isEnabled);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8 w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm border-primary/30">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl text-primary">Admin: Password Settings</CardTitle>
        </div>
        <CardDescription className="font-body text-muted-foreground pt-1">
          Control whether a password is required for guests to access the scrapbook.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-md border">
          <Switch
            id="password-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            aria-labelledby="password-toggle-label"
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
          />
          <Label htmlFor="password-toggle" id="password-toggle-label" className="font-body text-foreground flex-grow">
            Guest Password Requirement: <span className={isEnabled ? "font-semibold text-primary" : "font-semibold"}>{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </Label>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Setting
        </Button>
      </CardContent>
    </Card>
  );
}
