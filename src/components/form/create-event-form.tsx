'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from '~/hooks/use-toast';
import { createEvent } from '~/lib/actions/create-event.action';
import { CreateEventSchema, createEventSchema } from '~/validation/event-schema';
import { TextareaWithCounter } from '../textarea-with-counter';
import { Button } from '../ui/button';
import { FormItem, FormLabel, FormField, FormMessage, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { event } from '~/validation/constant';

type Props = {
  onSuccess?: () => void;
};

export const CreateEventForm = ({ onSuccess }: Props) => {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      shortDescription: '',
      title: '',
    },
    mode: 'onSubmit',
  });

  const { execute, isExecuting } = useAction(createEvent, {
    onError: (err) => {
      console.error(err);
      toast({
        title: 'Something went wrong',
        description: `Something went wrong. ${err.error.serverError}`,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      onSuccess?.();
      toast({
        title: 'Event created',
        description: 'Event created successfully',
        variant: 'default',
      });
    },
    onSettled: () => form.reset(),
  });

  const onSubmit = useCallback(async (values: CreateEventSchema) => {
    execute(values);
  }, []);

  const isDisabled = isExecuting || form.formState.isSubmitting;

  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          disabled={isDisabled}
          name='title'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  disabled={isDisabled}
                  placeholder='e.g. Engineering Meeting'
                  maxLength={event.name.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className='error-msg'>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          disabled={isDisabled}
          name='shortDescription'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <TextareaWithCounter
                  disabled={isDisabled}
                  placeholder='What is your event about?'
                  maxLength={event.shortDescription.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className='error-msg'>{form.formState.errors.shortDescription?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button className='mt-4 w-full' type='submit' disabled={isExecuting}>
          {isExecuting ? 'Creating...' : 'Create'}
        </Button>
      </form>
    </FormProvider>
  );
};
