import { useCallback, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';

interface ConfirmHook {
  (title: string, message: string): [() => JSX.Element, () => Promise<unknown>];
}

export const useConfirm: ConfirmHook = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const onConfirm = useCallback(
    () =>
      new Promise((resolve) => {
        setPromise({ resolve });
      }),
    [setPromise]
  );

  const handleClose = useCallback(
    (value: boolean) => {
      if (promise) {
        promise.resolve(value);
        setPromise(null);
      }
    },
    [promise, setPromise]
  );

  const handleCancel = useCallback(() => {
    promise?.resolve(false);
    handleClose(false);
  }, [handleClose, promise]);

  const handleConfirm = useCallback(() => {
    promise?.resolve(true);
    handleClose(true);
  }, [handleClose, promise]);

  const ConfirmDialog = () => (
    <Dialog open={!!promise} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='pt-2'>
          <Button variant='destructive' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, onConfirm];
};
