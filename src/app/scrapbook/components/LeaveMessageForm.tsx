
'use client'

import { useActionState } from 'react';
import { addMessageSubmission } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';

const initialState = {
  error: null,
  success: null,
  item: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Add to Scrapbook'
      )}
    </Button>
  );
}

interface LeaveMessageFormProps {
  onFormSuccess?: () => void;
}
// Ensure useActionState is imported and used correctly.
export function LeaveMessageForm({ onFormSuccess }: LeaveMessageFormProps) {
  const [state, formAction] = useActionState(addMessageSubmission, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Submission Received!",
        description: 'Thanks for adding your memory to the scrapbook.',
        variant: 'default',
        duration: 5000,
        action: (
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        ),
      });
      formRef.current?.reset();
      setPhotoPreview(null);
      if (onFormSuccess) {
        onFormSuccess();
      }
    } else if (state.error) {
       toast({
        title: 'Oops! Something went wrong.',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state, toast, onFormSuccess]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        // We'll set the value of a hidden input field to pass the data URI
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current)
      fileInputRef.current.value = '';
  }


  return (
    <form ref={formRef} action={formAction} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="contributor">Your Name</Label>
          <Input id="contributor" name="contributor" required placeholder="DJ Jazzy Jeff" />
        </div>
        <div>
          <Label htmlFor="title">Title for your message</Label>
          <Input id="title" name="title" placeholder="A blast from the past!" />
        </div>
        <div>
          <Label htmlFor="message">Message or Photo Caption</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Remember that time at the warehouse party in '98...?"
          />
        </div>
         <div>
          <Label htmlFor="photo">Upload a Photo</Label>
          <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className='w-full'>
            <Upload className="mr-2 h-4 w-4" /> Choose File
          </Button>
         </div>

         {photoPreview && (
            <div className='group relative'>
                <input type="hidden" name="photoDataUri" value={photoPreview} />
                <Image src={photoPreview} alt="Photo preview" width={400} height={300} className='h-auto w-full rounded-md object-cover' />
                <Button type="button" variant="destructive" size="icon" className='absolute right-2 top-2 h-7 w-7 transition-opacity group-hover:opacity-100' onClick={handleRemovePhoto}>
                    <X className='h-4 w-4' />
                    <span className='sr-only'>Remove photo</span>
                </Button>
            </div>
         )}
      </div>
      <SubmitButton />
    </form>
  );
}
