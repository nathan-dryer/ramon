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
    <Button
      type="submit"
      disabled={pending}
      /* rely on Button’s default “primary” variant for cohesive color,
         add motion / shadow utilities for micro-interaction */
      className="w-full shadow-lg hover:shadow-xl transform-gpu hover:scale-105 transition-all"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Post'
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
        title: <span className="font-sans font-semibold">Success!</span>,
        description: (
          <span className="font-serif">
            Your memory has been added to the scrapbook.
          </span>
        ),
        variant: 'success',
        duration: 3000,
      });
      formRef.current?.reset();
      setPhotoPreview(null);
      if (onFormSuccess) {
        onFormSuccess();
      }
    } else if (state.error) {
       toast({
        title: <span className="font-sans font-semibold">Submission Failed</span>,
        description: (
          <span className="font-serif">
            {state.error ?? 'Please try again in a moment.'}
          </span>
        ),
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
          <Label htmlFor="contributor" className="font-sans text-sm font-medium">
            Your Name
          </Label>
          <Input
            id="contributor"
            name="contributor"
            required
            maxLength={60}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label htmlFor="title" className="font-sans text-sm font-medium">
            Memory Title
          </Label>
          <Input
            id="title"
            name="title"
            maxLength={100}
            placeholder="Give your memory a title"
          />
        </div>
        <div>
          <Label htmlFor="message" className="font-sans text-sm font-medium">
            Message or Photo Caption
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            maxLength={1000}
            placeholder="Share your favorite memory of Ramon..."
          />
        </div>
         <div>
          <Label htmlFor="photo" className="font-sans text-sm font-medium">Upload a Photo</Label>
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
