
/**
 * Calculates the SHA-256 hash of a file.
 * @param file The file to hash.
 * @returns A promise that resolves with the hex string of the file's hash.
 */
export async function getFileHash(file: File): Promise<string> {
  // Read the file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Use the SubtleCrypto API to generate the hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
