import { v4 as uuidv4 } from 'uuid';

export function mapFilesToDescriptors(files: File[]) {
  const seen = new Set<string>();

  return files
    .filter((file) => {
      const key = `${file.name}|${file.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((file) => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      state: "ide",
    }));
}
