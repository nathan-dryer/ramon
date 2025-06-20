
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pin, PinOff, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useFormState } from 'react-dom';
import { togglePinScrapbookItem, deleteScrapbookItem } from '../actions';
import type { ScrapbookItemData } from '@/types';

interface AdminItemActionsProps {
  item: ScrapbookItemData;
}

export function AdminItemActions({ item }: AdminItemActionsProps) {
  const [isPinning, setIsPinning] = useState(false);
  const [isDeleting, setIsDeleting] =useState(false);

  // Note: The `action` function for useFormState must be defined in a Server Component.
  // We are calling server actions directly here. This is fine for simple cases.
  // For more complex forms, you might use a form-specific Server Action.

  const handleTogglePin = async () => {
    setIsPinning(true);
    try {
       await togglePinScrapbookItem(item.id);
       // Re-validation is handled by the server action
    } catch (error) {
        console.error("Failed to toggle pin:", error);
        // Optionally: show an error toast to the user
    } finally {
        setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
        setIsDeleting(true);
        try {
            await deleteScrapbookItem(item.id);
            // Re-validation will refresh the list
        } catch (error) {
            console.error("Failed to delete item:", error);
        } finally {
            setIsDeleting(false);
        }
    }
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <span className="sr-only">Open item menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleTogglePin} disabled={isPinning}>
          {isPinning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : item.pinned ? (
            <PinOff className="mr-2 h-4 w-4" />
          ) : (
            <Pin className="mr-2 h-4 w-4" />
          )}
          <span>{isPinning ? 'Updating...' : item.pinned ? 'Unpin Item' : 'Pin Item'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
           {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="mr-2 h-4 w-4" />
           )}
          <span>{isDeleting ? 'Deleting...' : 'Delete Item'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
