// UUID v4 uses 122 random bits. getRandomValues is available in ordinary HTTP
// contexts in supported browsers, unlike randomUUID (a secure-context API).
// Never fall back to timestamps, counters or Math.random.
export function createId(provider = globalThis.crypto) {
  try {
    if (typeof provider?.randomUUID === 'function') {
      const id = provider.randomUUID();
      if (typeof id !== 'string' ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error('Invalid UUID');
      }
      return id;
    }
    if (typeof provider?.getRandomValues !== 'function') throw new Error('No secure randomness');
    const bytes = new Uint8Array(16);
    provider.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  } catch {
    throw new Error('Não foi possível gerar identificadores seguros neste navegador. Atualize o navegador ou abra o aplicativo por HTTPS.');
  }
}
