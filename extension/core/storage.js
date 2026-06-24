// Adaptador de almacenamiento para que supabase-js persista la sesión en
// chrome.storage.local (el localStorage del popup no sobrevive entre aperturas).
export const chromeStorageAdapter = {
  async getItem(key) {
    const res = await chrome.storage.local.get(key);
    return res[key] ?? null;
  },
  async setItem(key, value) {
    await chrome.storage.local.set({ [key]: value });
  },
  async removeItem(key) {
    await chrome.storage.local.remove(key);
  },
};
