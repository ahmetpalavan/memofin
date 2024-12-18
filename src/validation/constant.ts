export const event = {
  slug: {
    minLength: 1,
    maxLength: 255,
  },
  shortDescription: {
    minLength: 1,
    maxLength: 255,
  },
  name: {
    minLength: 1,
    maxLength: 255,
  },
} as const;

export const question = {
  minLength: 1,
  maxLength: 2500,
} as const;

export const poll = {
  body: {
    minLength: 1,
    maxLength: 255,
  },
  options: {
    minCount: 2,
    maxCount: 6,
    minLength: 1,
    maxLength: 255,
  },
} as const;
