import { supabase } from '../lib/supabase';

const TABLE = 'personal_finances';

const PersonalFinancesModel = {
  async findByUserAndPeriod(userId, fiscalYear, fiscalMonth) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .eq('fiscal_year', fiscalYear)
      .eq('fiscal_month', fiscalMonth)
      .single();
    if (error) throw error;
    return data;
  },

  async findAllByUser(userId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('fiscal_year', { ascending: false })
      .order('fiscal_month', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findByYear(userId, fiscalYear) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .eq('fiscal_year', fiscalYear)
      .order('fiscal_month', { ascending: true });
    if (error) throw error;
    return data;
  },

  async upsert(financeData) {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(financeData, { onConflict: 'user_id,fiscal_year,fiscal_month' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, financeData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(financeData)
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

  getTotalIncome(record) {
    return (
      (record.salary ?? 0) +
      (record.bonuses ?? 0) +
      (record.dividends ?? 0) +
      (record.commissions ?? 0) +
      (record.other_income ?? 0)
    );
  },

  getTotalExpenses(record) {
    return (
      (record.housing ?? 0) +
      (record.food ?? 0) +
      (record.transportation ?? 0) +
      (record.debts ?? 0) +
      (record.entertainment ?? 0) +
      (record.family ?? 0)
    );
  },

  getBalance(record) {
    return this.getTotalIncome(record) - this.getTotalExpenses(record);
  },
};

export default PersonalFinancesModel;
