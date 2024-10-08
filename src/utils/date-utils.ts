export const onlyDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
});

export const defaultDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
