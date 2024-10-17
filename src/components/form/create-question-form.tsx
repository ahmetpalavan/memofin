'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Event, User } from '@prisma/client';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { useAction } from 'next-safe-action/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from '~/hooks/use-toast';
import { createQuestionAction } from '~/lib/actions/create-question.action';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { cn } from '~/lib/utils';
import { question } from '~/validation/constant';
import { createQuestionSchema, CreateQuestionSchema } from '~/validation/question-schema';
import { TextareaWithCounter } from '../textarea-with-counter';
import { Button, buttonVariants } from '../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type Props = {
  eventSlug: Event['slug'];
  ownerId: User['id'];
  onSuccess: (data: QuestionDetail) => void;
};

export const CreateQuestionForm = ({ eventSlug, ownerId, onSuccess: handleSuccess }: Props) => {
  const { isAuthenticated } = useKindeBrowserClient();

  const formSchema = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      body: '',
      ownerId,
      eventSlug,
    },
    mode: 'onSubmit',
  });

  const { isExecuting, execute } = useAction(createQuestionAction, {
    onSuccess: ({ data }) => {
      if (data) {
        handleSuccess(data);
        toast({
          title: 'Question posted',
          variant: 'default',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Failed to post question',
        variant: 'destructive',
        description: "We couldn't post your question. Please try again later.",
      });
    },
    onSettled: () => {
      formSchema.reset();
    },
  });

  const disabled = formSchema.formState.isSubmitting || isExecuting;

  const onSubmit = (data: CreateQuestionSchema) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    execute(data);
  };

  return (
    <FormProvider {...formSchema}>
      <form onSubmit={formSchema.handleSubmit(onSubmit)} className='py-2 px-4 bg-white border border-primary/60 rounded-lg shadow-sm'>
        <FormField
          name='body'
          control={formSchema.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Question</FormLabel>

              <FormControl>
                <TextareaWithCounter
                  disabled={disabled}
                  placeholder='What do you want to ask about?'
                  maxLength={question.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className='text-destructive'>{formSchema.formState.errors.body?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className='flex justify-end mt-4'>
          <div className='flex space-x-2'>
            {isAuthenticated ? (
              <Button disabled={disabled} type='submit' size='lg'>
                <ChatBubbleIcon className='w-4 h-4 mr-2' />
                <span className='text-xs lg:text-sm'>{isExecuting ? 'Posting...' : 'Ask'}</span>
              </Button>
            ) : (
              <RegisterLink className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}>
                <ChatBubbleIcon className='w-4 h-4 mr-2' />
                <span className='text-xs lg:text-sm'>Ask</span>
              </RegisterLink>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
