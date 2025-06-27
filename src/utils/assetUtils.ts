
export const getAssetName = (asset: any): string => {
  if (!asset) return 'No Asset';
  if (typeof asset === 'string') return asset;
  if (typeof asset === 'object' && asset.name) return asset.name;
  return 'Unknown Asset';
};

export const getLocationName = (location: any): string => {
  if (!location) return 'No Location';
  if (typeof location === 'string') return location;
  if (typeof location === 'object' && location.name) return location.name;
  return 'Unknown Location';
};
