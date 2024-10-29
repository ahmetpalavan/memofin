import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://oktjptoyvusqjmwvjkcc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdGpwdG95dnVzcWptd3Zqa2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4OTIxMTMsImV4cCI6MjA0MzQ2ODExM30.lQx6dSu9BfIZg8uOBnsSLzqOZYlMgeLXfr9ZIeWKxTc'
);
