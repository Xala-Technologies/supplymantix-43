
export const getAssetName = (asset: string | { id: string; name: string; status?: string } | undefined): string => {
  if (!asset) return 'No asset assigned';
  if (typeof asset === 'string') return asset;
  return asset.name;
};

export const getLocationName = (location: string | { id: string; name: string } | undefined): string => {
  if (!location) return 'No location';
  if (typeof location === 'string') return location;
  return location.name;
};
