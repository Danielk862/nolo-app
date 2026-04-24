import { supabase } from '../lib/supabase';

const TABLE = 'credentials';

const CredentialsModel = {
  async findByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, username, user_id, created_at, updated_at')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async findByUsername(username) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, username, user_id, created_at, updated_at')
      .eq('username', username)
      .single();
    if (error) throw error;
    return data;
  },

  async create(credentialsData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert([credentialsData])
      .select('id, username, user_id, created_at, updated_at')
      .single();
    if (error) throw error;
    return data;
  },

  async updatePassword(userId, newPassword) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ password: newPassword })
      .eq('user_id', userId)
      .select('id, username, user_id, updated_at')
      .single();
    if (error) throw error;
    return data;
  },

  async updateUsername(userId, newUsername) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ username: newUsername })
      .eq('user_id', userId)
      .select('id, username, user_id, updated_at')
      .single();
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};

export default CredentialsModel;
