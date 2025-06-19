'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addVideoSubmission } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, UploadCloud } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto bg-accent2-DEFAULT hover:bg-accent2-DEFAULT/80 text-accent2-foreground button-neon-glow" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
      <span>Add Video</span>
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
      formRef.current?.reset(); 
    }
  }, [state, toast]);


  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      <div>
        <Label htmlFor="title" className="font-body text-foreground">Video Title</Label>
        <Input id="title" name="title" required className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground"/>
      </div>
      <div>
        <Label htmlFor="videoUrl" className="font-body text-foreground">Video URL or Embed Code</Label>
        <Textarea id="videoUrl" name="videoUrl" required rows={3} className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground" placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID or <iframe ...></iframe>"/>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          Supports YouTube/Vimeo embed URLs, direct .mp4 links, or full iframe embed code.
        </p>
      </div>
      <div>
        <Label htmlFor="contributor" className="font-body text-foreground">Contributor Name (Optional)</Label>
        <Input id="contributor" name="contributor" className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground" placeholder="e.g., Site Admin or Family Friend"/>
      </div>
      <SubmitButton />
    </form>
  );
}
