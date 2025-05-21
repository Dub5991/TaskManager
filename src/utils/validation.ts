export function validateTask(title: string, description: string): string | null {
  if (!title.trim()) return 'Title is required';
  if (!description.trim()) return 'Description is required';
  return null;
}