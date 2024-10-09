'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Event, User } from '@prisma/client';
import { FormProvider, useForm } from 'react-hook-form';
import { QuestionDetail } from '~/lib/prisma/validators/question-validator';
import { createQuestionSchema, CreateQuestionSchema } from '~/validation/question-schema';
import { TextareaWithCounter } from '../textarea-with-counter';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { question } from '~/validation/constant';
import { RegisterLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Button, buttonVariants } from '../ui/button';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { cn } from '~/lib/utils';
import routes, { BASE_URL } from '~/config/routes';

type Props = {
  eventSlug: Event['slug'];
  ownerId: User['id'];
  onSuccess: (data: QuestionDetail) => void;
};

export const CreateQuestionForm = ({ eventSlug, ownerId, onSuccess }: Props) => {
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

  const isExecuting = false;

  const disabled = formSchema.formState.isSubmitting || isExecuting;

  const onSubmit = async (data: CreateQuestionSchema) => {
    if (disabled) return;

    try {
      // const res = await createQuestion(data);
      // onSuccess(res);
      console.log(data);
      formSchema.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...formSchema}>
      <form onSubmit={formSchema.handleSubmit(onSubmit)} className='py-2 px-4 bg-white border border-primary/60 rounded-lg shadow-sm'>
        <FormField
          control={formSchema.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <TextareaWithCounter
                  disabled={disabled}
                  placeholder='Ask a question...'
                  maxLength={question.maxLength}
                  minLength={question.minLength}
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-destructive text-xs'>{formSchema.formState.errors.body?.message}</FormMessage>
            </FormItem>
          )}
          name='body'
        />
        <div className='flex justify-end mt-4'>
          <div className='flex space-x-2'>
            {isAuthenticated ? (
              <Button type='submit' size='lg'>
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
