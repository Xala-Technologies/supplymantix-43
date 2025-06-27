
export const getAssetName = (asset: any) => {
  if (!asset) return 'No asset';
  if (typeof asset === 'string') return asset;
  return asset.name || asset.title || 'Unknown asset';
};

export const getLocationName = (location: any) => {
  if (!location) return 'No location';
  if (typeof location === 'string') return location;
  return location.name || location.title || 'Unknown location';
};
