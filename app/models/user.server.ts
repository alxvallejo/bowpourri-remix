import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';

export type User = { id: string; email: string };

// Abstract this away
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

invariant(
  supabaseUrl,
  'SUPABASE_URL must be set in your environment variables.'
);
invariant(
  supabaseAnonKey,
  'SUPABASE_ANON_KEY must be set in your environment variables.'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  const { user } = data;

  // get the user profile after created
  const profile = await getProfileByEmail(user?.email);

  // Update profile with name
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', profile?.id)
    .single();

  return user;
}

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, name, score, id')
    .eq('id', id)
    .single();

  if (error) return null;
  if (data) return { id: data.id, email: data.email };
}

export async function getProfileByEmail(email?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, name, score, id')
    .eq('email', email)
    .single();

  if (error) return null;
  if (data) return data;
}

export async function verifyLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  const { user } = data;

  if (error) return undefined;
  const profile = await getProfileByEmail(user?.email);

  return profile;
}
