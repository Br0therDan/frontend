import { Button } from '@/components/ui/button';
import React from "react";
import { MyButton } from './submit-button';
import { cn } from '@/lib/utils';

interface FooterButtonProps {
  onCancel: () => void;
  isSubmitting: boolean;
  mode: string;
  isDirty: boolean;
  className?: string;
}

export default function FooterButton( { onCancel, isSubmitting, mode, isDirty, className }: FooterButtonProps) {
  return (
    <footer className='sticky bottom-0 right-0 p-4 border-t z-50 sm:px-8 bg-background'>
    <div className='flex justify-between'>
      <Button
        variant='outline'
        onClick={onCancel}
        disabled={isSubmitting}
        type='button'
        className={cn('px-4', className)}
      >
      </Button>
      <MyButton
        variant="outline"
        type='submit'
        isLoading={isSubmitting}
        disabled={mode === 'add' ? !isDirty : isSubmitting}
        className={cn('px-4', className)}
      >
      </MyButton>
    </div>
  </footer>
  )
}
