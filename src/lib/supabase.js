import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// SecureStore has a 2KB limit per key on iOS.
// This adapter splits large values across multiple keys to avoid that limit.
const SecureStoreAdapter = {
  async getItem(key) {
    const n = await SecureStore.getItemAsync(`${key}_n`);
    if (!n) return SecureStore.getItemAsync(key);
    const chunks = await Promise.all(
      Array.from({ length: Number(n) }, (_, i) =>
        SecureStore.getItemAsync(`${key}_${i}`)
      )
    );
    return chunks.join('');
  },
  async setItem(key, value) {
    const chunkSize = 1800;
    if (value.length <= chunkSize) {
      await SecureStore.deleteItemAsync(`${key}_n`).catch(() => {});
      return SecureStore.setItemAsync(key, value);
    }
    const chunks = [];
    for (let i = 0; i < value.length; i += chunkSize) {
      chunks.push(value.slice(i, i + chunkSize));
    }
    await Promise.all(
      chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}_${i}`, chunk))
    );
    await SecureStore.setItemAsync(`${key}_n`, String(chunks.length));
  },
  async removeItem(key) {
    const n = await SecureStore.getItemAsync(`${key}_n`);
    if (n) {
      await Promise.all(
        Array.from({ length: Number(n) }, (_, i) =>
          SecureStore.deleteItemAsync(`${key}_${i}`)
        )
      );
      await SecureStore.deleteItemAsync(`${key}_n`);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
