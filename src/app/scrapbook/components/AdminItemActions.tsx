
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Pin, PinOff, Trash2, Loader2 } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ScrapbookItemData } from '@/types';
import { togglePinScrapbookItem, deleteScrapbookItem } from '../actions';

interface AdminItemActionsProps {
  item: ScrapbookItemData;
}

interface ActionState {
  error?: string | null;
  success?: string | null;
}

function PinButton({ pinned }: { pinned: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-primary data-[pinned=true]:text-primary"
      data-pinned={pinned}
      disabled={pending}
      aria-label={pinned ? 'Unpin item' : 'Pin item'}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
    </Button>
  );
}

interface DeleteButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function DeleteButton({ onClick }: DeleteButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
      disabled={pending}
      aria-label="Delete item"
      onClick={onClick}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}

export function AdminItemActions({ item }: AdminItemActionsProps) {
  const [pinState, pinFormAction] = useActionState<ActionState, FormData>(togglePinScrapbookItem.bind(null, item.id), { error: null, success: null });
  const [deleteState, deleteFormAction] = useActionState<ActionState, FormData>(deleteScrapbookItem.bind(null, item.id), { error: null, success: null });
  const { toast } = useToast();

  useEffect(() => {
    if (pinState?.error) toast({ variant: 'destructive', title: 'Pin Error', description: pinState.error });
    // Pin success toast can be noisy.
    // if (pinState?.success) toast({ title: 'Success', description: pinState.success });
  }, [pinState, toast]);

  useEffect(() => {
    if (deleteState?.error) toast({ variant: 'destructive', title: 'Delete Error', description: deleteState.error });
    if (deleteState?.success) toast({ title: 'Deleted', description: deleteState.success });
  }, [deleteState, toast]);

  const handleDeleteConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title || `item ${item.id}`}"? This cannot be undone.`)) {
      event.preventDefault(); // Prevent form submission if user clicks "Cancel"
    }
  };

  return (
    <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-card/70 backdrop-blur-sm p-1 rounded-md">
      <form action={pinFormAction}>
        <PinButton pinned={!!item.pinned} />
      </form>
      <form action={deleteFormAction}>
        <DeleteButton onClick={handleDeleteConfirm} />
      </form>
    </div>
  );
}
