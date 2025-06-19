'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addMessageSubmission } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto bg-accent2-DEFAULT hover:bg-accent2-DEFAULT/80 text-accent2-foreground button-neon-glow" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      <span>Post Message</span>
    </Button>
  );
}

const initialState = {
  error: null as string | null,
  success: null as string | null,
};

interface LeaveMessageFormProps {
  onSuccess?: () => void;
}

export function LeaveMessageForm({ onSuccess }: LeaveMessageFormProps) {
  const [state, formAction] = useFormState(addMessageSubmission, initialState);
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
        title: "Success!",
        description: state.success,
        action: <CheckCircle className="text-green-500" />,
      });
      formRef.current?.reset();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state, toast, onSuccess]);

  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      <div>
        <Label htmlFor="contributor" className="font-body text-foreground">Your Name / Alias (Optional)</Label>
        <Input 
          id="contributor" 
          name="contributor" 
          className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground" 
          placeholder="e.g., DJ Sparklefingers"
        />
      </div>
       <div>
        <Label htmlFor="title" className="font-body text-foreground">Message Title (Optional)</Label>
        <Input 
          id="title" 
          name="title" 
          className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground" 
          placeholder="e.g., Happy Birthday Legend!"
        />
      </div>
      <div>
        <Label htmlFor="message" className="font-body text-foreground">Your Message / Roast / Toast</Label>
        <Textarea 
          id="message" 
          name="message" 
          required 
          rows={5} 
          className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground" 
          placeholder="Share a memory, a wish, or a funny story..."
          minLength={5}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1 font-body">
          Let Ramon know you're thinking of him! (Max 1000 characters)
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
