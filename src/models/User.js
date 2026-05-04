import { supabase } from '../lib/supabase';

const TABLE = 'users';

const UserModel = {
  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  },

  async findByDocumentNumber(documentNumber) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('document_number', documentNumber)
      .single();
    if (error) throw error;
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, userData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};

export default UserModel;
