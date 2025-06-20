'use client';

import { Loader2, Pin, PinOff } from 'lucide-react';
import { useActionState, useEffect } from 'react'; // Changed useFormState to useActionState

import { Button } from '@/components/ui/button';
import { togglePinAdminVideo } from './actions';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';

interface PinToggleButtonState {
  error?: string | null;
  success?: string | null;
}

function SubmitPinButton({ pinned }: { pinned: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      variant="ghost" 
      size="sm" // Adjusted size for better fit
      disabled={pending} 
      aria-label={pinned ? "Unpin video" : "Pin video"}
      className="text-muted-foreground hover:text-primary data-[pinned=true]:text-primary"
      data-pinned={pinned}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : (pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />)}
    </Button>
  );
}

export function PinToggleButton({ videoId, isPinned }: { videoId: string; isPinned: boolean }) {
  // Bind videoId to the action
  const actionWithVideoId = togglePinAdminVideo.bind(null, videoId);
  const [state, formAction] = useActionState<PinToggleButtonState, FormData>(actionWithVideoId, { error: null, success: null }); // Changed useFormState to useActionState
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
    // Success toast can be a bit noisy for quick actions like pinning.

  }, [state, toast]);

  return (
    <form action={formAction} className="inline-flex">
      <SubmitPinButton pinned={isPinned} />
    </form>
  );
}
