'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Poll, PollOption, User } from '@prisma/client';
import debounce from 'lodash.debounce';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { match } from 'ts-pattern';
import routes, { BASE_URL } from '~/config/routes';
import { votePollOption } from '~/lib/actions/vote-poll-option.action';
import { PollDetails } from '~/lib/prisma/validators/poll-validator';
import { supabase } from '~/lib/supabase/client';

type VoteEvent = {
  pollId: Poll['id'];
  authorId: User['id'];
  pollOptionId: PollOption['id'];
};

export const useLivePoll = ({ poll: initialPoll }: { poll: PollDetails }) => {
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const [poll, setPoll] = useState<PollDetails>(initialPoll);
  const [votePollOptionIndex, setVotePollOptionIndex] = useState<number | undefined>();

  const { execute: executeVote } = useAction(votePollOption, {
    onSuccess: () => {
      console.log('Vote successful');
    },
    onError: (error) => {
      console.error('Vote failed', error);
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('live-votes')
      .on<VoteEvent>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'PollVote',
        },
        ({ old: oldVote, eventType, new: newVote }) => {
          match(eventType)
            .with('INSERT', () => {
              const { authorId, pollId, pollOptionId } = newVote as VoteEvent;

              if (authorId === user?.id) {
                return;
              }

              setPoll((prevPoll) => ({
                ...prevPoll,
                _count: {
                  votes: prevPoll._count.votes + 1,
                },
                options: prevPoll.options.map((option) => {
                  if (option.id === pollOptionId) {
                    return {
                      ...option,
                      votes: [
                        ...option.votes,
                        {
                          authorId,
                          pollId,
                          pollOptionId,
                        },
                      ],
                      _count: {
                        votes: option._count.votes + 1,
                      },
                    };
                  }

                  return option;
                }),
              }));
            })
            .with('DELETE', () => {
              const { authorId } = oldVote as VoteEvent;

              console.log(`Vote deleted by ${authorId}`);

              if (authorId === user?.id) {
                return;
              }

              setPoll((prevPoll) => ({
                ...prevPoll,
                _count: {
                  votes: prevPoll._count.votes - 1,
                },
                options: prevPoll.options.map((option) => {
                  const wasVotedByUser = option.votes.some((vote) => vote.authorId === authorId);

                  if (!wasVotedByUser) {
                    return {
                      ...option,
                      votes: option.votes.filter((vote) => vote.authorId !== authorId),
                      _count: {
                        votes: option._count.votes - 1,
                      },
                    };
                  }

                  return option;
                }),
              }));
            });
        }
      )
      .subscribe((status, error) => {
        console.log(`Channel status: ${status}`, error);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    const votedOptionIndex = initialPoll.options.find((option) => {
      option.votes.some((vote) => vote.authorId === user?.id);
    })?.index;

    setVotePollOptionIndex(votedOptionIndex);
  }, [user, initialPoll.options]);

  const voteOption = useCallback(
    (newVoteOptionIndex: number) => {
      if (!user) {
        return router.replace(
          `${routes.register}?post_login_redirect_url=${BASE_URL}${routes.eventPolls({
            eventSlug: poll.event.slug,
            ownerId: poll.event.ownerId,
          })}`
        );
      }

      const hasVoted = votePollOptionIndex != null;
      const oldVotedOptionIndex = votePollOptionIndex;

      if (newVoteOptionIndex === oldVotedOptionIndex) {
        return;
      }

      const updatedPoll: PollDetails = {
        ...poll,
        _count: {
          votes: hasVoted ? poll._count.votes : poll._count.votes + 1,
        },
        options: poll.options.map((option) => {
          if (option.index === newVoteOptionIndex) {
            return {
              ...option,
              _count: {
                votes: option._count.votes + 1,
              },
            };
          }

          if (option.index === oldVotedOptionIndex) {
            return {
              ...option,
              _count: {
                votes: option._count.votes - 1,
              },
            };
          }

          return option;
        }),
      };

      setPoll(updatedPoll);
      setVotePollOptionIndex(newVoteOptionIndex);

      performVote(newVoteOptionIndex);
    },
    [poll, user, votePollOptionIndex, router]
  );

  const performVote = useCallback(
    debounce(
      (optionIndex: number) => {
        executeVote({
          optionIndex,
          pollId: poll.id,
        });
      },
      1000,
      {
        leading: false,
        trailing: true,
      }
    ),
    [poll.id]
  );

  return {
    poll,
    voteOption,
    votePollOptionIndex,
  };
};
