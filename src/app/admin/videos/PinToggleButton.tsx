
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { togglePinAdminVideo } from './actions';
import { Button } from '@/components/ui/button';
import { Pin, PinOff, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
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
  const [state, formAction] = useFormState<PinToggleButtonState, FormData>(actionWithVideoId, { error: null, success: null });
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
    // Success toast can be a bit noisy for quick actions like pinning.
    // if (state?.success) {
    //   toast({ title: "Success", description: state.success });
    // }
  }, [state, toast]);

  return (
    <form action={formAction} className="inline-flex">
      <SubmitPinButton pinned={isPinned} />
    </form>
  );
}
