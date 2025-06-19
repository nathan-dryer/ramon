'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addVideoSubmission } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Add Video
    </Button>
  );
}

const initialState = {
  error: null as string | null,
  success: null as string | null,
};

export function VideoAdminForm() {
  const [state, formAction] = useFormState(addVideoSubmission, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
    if (state?.success) {
      toast({
        title: "Success",
        description: state.success,
        action: <CheckCircle className="text-green-500" />,
      });
      formRef.current?.reset(); // Reset form on success
    }
  }, [state, toast]);


  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      <div>
        <Label htmlFor="title" className="font-body">Video Title</Label>
        <Input id="title" name="title" required className="mt-1"/>
      </div>
      <div>
        <Label htmlFor="videoUrl" className="font-body">Video URL or Embed Code</Label>
        <Textarea id="videoUrl" name="videoUrl" required rows={3} className="mt-1" placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID or <iframe ...></iframe>"/>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          Supports YouTube/Vimeo embed URLs, direct .mp4 links, or full iframe embed code.
        </p>
      </div>
      <div>
        <Label htmlFor="contributor" className="font-body">Contributor Name (Optional)</Label>
        <Input id="contributor" name="contributor" className="mt-1" placeholder="e.g., Site Admin or Family Friend"/>
      </div>
      <SubmitButton />
    </form>
  );
}
