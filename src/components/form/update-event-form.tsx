'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from '~/hooks/use-toast';
import { updateEventAction } from '~/lib/actions/update-event.action';
import { EventDetail } from '~/lib/prisma/validators/event-validator';
import { updateEventSchema, UpdateEventSchema } from '~/validation/event-schema';
import { TextareaWithCounter } from '../textarea-with-counter';
import { Button } from '../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  event: EventDetail;
  onSuccess?: () => void;
};

export const UpdateEventForm = ({ onSuccess: handleSuccess, event }: Props) => {
  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      eventId: event.id,
      shortDescription: event.shortDescription ?? '',
    },
    mode: 'onSubmit',
  });

  const { execute, isExecuting } = useAction(updateEventAction, {
    onError: (err) => {
      console.error(err);
      toast({
        title: 'Something went wrong',
        description: `Something went wrong. ${err.error.serverError}`,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      handleSuccess?.();
      toast({
        title: 'Event updated',
        description: 'Event updated successfully',
      });
    },
    onSettled: () => form.reset(),
  });

  const onSubmit = useCallback(async (values: UpdateEventSchema) => {
    execute(values);
  }, []);

  const isDisabled = isExecuting || form.formState.isSubmitting;

  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormItem>
          <FormLabel>Event Name</FormLabel>
          <Input type='text' disabled value={event.name} />
        </FormItem>
        <FormField
          name='shortDescription'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <TextareaWithCounter
                  defaultValue={event.shortDescription ?? ''}
                  disabled={isDisabled}
                  {...field}
                  maxLength={event.shortDescription?.length ?? event.shortDescription?.length}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.shortDescription?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isDisabled}>
          {isExecuting ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </FormProvider>
  );
};
