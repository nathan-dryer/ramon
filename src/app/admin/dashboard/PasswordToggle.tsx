
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updatePasswordSetting } from './actions';
import { Loader2 } from 'lucide-react';

export function PasswordToggle({ isEnabled: initialIsEnabled }: { isEnabled: boolean }) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Requirement</CardTitle>
        <CardDescription>Enable or disable the password requirement for the main application.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="password-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            aria-labelledby="password-toggle-label"
          />
          <Label htmlFor="password-toggle" id="password-toggle-label">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Setting
        </Button>
      </CardContent>
    </Card>
  );
}
