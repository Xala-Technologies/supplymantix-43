
export const groupBy = <T, K extends string | number>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keySelector(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(
  array: T[],
  keySelector: (item: T) => string | number,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = keySelector(a);
    const bValue = keySelector(b);
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const unique = <T>(array: T[], keySelector?: (item: T) => unknown): T[] => {
  if (!keySelector) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
