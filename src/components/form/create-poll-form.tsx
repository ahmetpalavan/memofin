import { zodResolver } from '@hookform/resolvers/zod';
import { Event } from '@prisma/client';
import { useAction } from 'next-safe-action/hooks';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { toast } from '~/hooks/use-toast';
import { createLivePollAction } from '~/lib/actions/create-live-poll.action';
import { poll } from '~/validation/constant';
import { CreateLivePollSchema, createLivePollSchema } from '~/validation/poll-schema';
import { TextareaWithCounter } from '../textarea-with-counter';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash } from 'lucide-react';

type Props = {
  eventId: Event['id'];
  onSuccess?: () => void;
};

export const CreatePollForm = ({ eventId, onSuccess: handleSuccess }: Props) => {
  const form = useForm({
    resolver: zodResolver(createLivePollSchema),
    defaultValues: {
      body: '',
      options: ['option 1', 'option 2'],
      eventId,
    },
    mode: 'onSubmit',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: 'options',
  });

  const { execute, isExecuting } = useAction(createLivePollAction, {
    onError: (err) => {
      console.log(err);
      toast({
        title: 'Failed to create poll',
        description: `Failed to create poll. ${err.error.serverError}`,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      handleSuccess?.();
      toast({
        title: 'Poll created',
        description: 'Poll created successfully',
        variant: 'default',
      });
    },
    onSettled: () => form.reset(),
  });

  const onSubmit = async (values: CreateLivePollSchema) => {
    execute(values);
  };

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='body'
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Poll body</FormLabel>
                <FormControl>
                  <TextareaWithCounter
                    maxLength={poll.body.maxLength}
                    disabled={isFieldDisabled}
                    placeholder='What do you want to ask?'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-destructive'>{form.formState.errors.body?.message}</FormMessage>
              </FormItem>
            );
          }}
        />
        <div role='list' className='mt-8 space-y-4'>
          <FormLabel className='block'>Options (max {poll.options.maxCount})</FormLabel>
          <FormMessage className='text-destructive'>{form.formState.errors.root?.message}</FormMessage>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              name={`options.${index}`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-x-2'>
                      <span className='text-primary'>{index + 1}.</span>
                      <Input {...field} disabled={isFieldDisabled} maxLength={poll.options.maxLength} placeholder='Enter option' />
                      <Button type='button' onClick={() => remove(index)} disabled={isFieldDisabled} variant='destructive' size='sm'>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-destructive'>{form.formState.errors.options?.[index]?.message}</FormMessage>
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            onClick={() => append(`option ${fields.length + 1}`)}
            disabled={isFieldDisabled || fields.length >= poll.options.maxCount}
            variant='default'
            size='sm'
            className='mt-4'
          >
            <Plus />
          </Button>
        </div>
        <div className='flex justify-end mt-8'>
          <Button disabled={isFieldDisabled} type='submit' size='lg'>
            {isExecuting ? 'Creating...' : 'Create poll'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
