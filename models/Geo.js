import { supabase } from '../lib/supabase';

const GeoModel = {
  async getCountries() {
    const { data, error } = await supabase
      .from('countries')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data;
  },

  async getStatesByCountry(countryId) {
    const { data, error } = await supabase
      .from('states')
      .select('id, name')
      .eq('country_id', countryId)
      .order('name');
    if (error) throw error;
    return data;
  },

  async getCitiesByState(stateId) {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name')
      .eq('state_id', stateId)
      .order('name');
    if (error) throw error;
    return data;
  },
};

export default GeoModel;
