'use client';

import { forwardRef, useCallback, useState } from 'react';
import { cn, PropsWithClassName } from '~/lib/utils';
import { Textarea, TextareaProps } from './ui/textarea';

type Props = PropsWithClassName<TextareaProps>;

export const TextareaWithCounter = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, defaultValue = '', maxLength = 1000, autoComplete = 'off', onChange, autoFocus = false, ...props }, forwardRef) => {
    const [content, setContent] = useState<string>(defaultValue as string);

    const onChangeHandler = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setContent(value);
        onChange?.(event);
      },
      [onChange]
    );

    return (
      <div>
        <Textarea
          ref={forwardRef}
          className={cn(
            'min-h-10 max-h-32 border border-primary ring-primary/50 resize-none focus-visible:ring-primary focus-visible:ring-2',
            className
          )}
          value={content}
          defaultValue={defaultValue}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onChange={onChangeHandler}
          autoFocus={autoFocus}
          {...props}
        />
        <div className='flex justify-end text-sm text-primary/60'>
          {content.length}/{maxLength}
        </div>
      </div>
    );
  }
);
