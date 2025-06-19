
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addMessageSubmission } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, Send, UploadCloud, XCircle, Image as ImageIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto bg-accent2-DEFAULT hover:bg-accent2-DEFAULT/80 text-accent2-foreground button-neon-glow" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      <span>Post Submission</span>
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);


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
      setPhotoPreview(null);
      setPhotoName(null);
      setPhotoDataUri(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state, toast, onSuccess]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        setPhotoPreview(null);
        setPhotoName(null);
        setPhotoDataUri(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      setPhotoName(null);
      setPhotoDataUri(null);
    }
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoName(null);
    setPhotoDataUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      {photoDataUri && <input type="hidden" name="photoDataUri" value={photoDataUri} />}
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
        <Label htmlFor="title" className="font-body text-foreground">Title (Optional)</Label>
        <Input
          id="title"
          name="title"
          className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground"
          placeholder="e.g., Happy Birthday Legend! / My Awesome Pic"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photoFile" className="font-body text-foreground">Upload a Photo (Optional)</Label>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-input/30 hover:bg-input/60 border-border text-foreground">
            <UploadCloud className="mr-2 h-4 w-4" />
            Choose Photo
          </Button>
          <Input
            id="photoFile"
            name="photoFile" // Name attribute for the file input itself, though we use data URI
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" // Visually hidden, triggered by button
          />
          {photoName && <span className="text-sm text-muted-foreground truncate max-w-[150px]">{photoName}</span>}
          {photoPreview && (
            <Button type="button" variant="ghost" size="icon" onClick={clearPhoto} className="text-muted-foreground hover:text-destructive">
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        {photoPreview && (
          <div className="mt-2 relative w-full aspect-video max-h-[200px] rounded border border-border overflow-hidden">
            <Image src={photoPreview} alt="Photo preview" layout="fill" objectFit="contain" />
          </div>
        )}
         <p className="text-xs text-muted-foreground font-body">
          Max file size: 5MB. Accepted formats: JPG, PNG, GIF.
        </p>
      </div>

      <div>
        <Label htmlFor="message" className="font-body text-foreground">Your Message / Photo Caption</Label>
        <Textarea
          id="message"
          name="message"
          rows={photoPreview ? 3 : 5}
          className="mt-1 bg-input/50 border-border focus:ring-accent2-DEFAULT text-foreground"
          placeholder={photoPreview ? "Add a caption for your photo..." : "Share a memory, a wish, or a funny story..."}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1 font-body">
          Let Ramon know you're thinking of him! (Max 1000 characters for messages or captions)
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
