
export const exportAssetsToCSV = (assets: any[]) => {
  const headers = [
    'ID',
    'Name',
    'Asset Tag',
    'Status',
    'Location',
    'Category',
    'Criticality',
    'Description',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...assets.map(asset => [
      asset.id,
      `"${asset.name || ''}"`,
      `"${asset.asset_tag || ''}"`,
      asset.status || '',
      `"${asset.location || ''}"`,
      asset.category || '',
      asset.criticality || '',
      `"${asset.description || ''}"`,
      asset.created_at || '',
      asset.updated_at || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const importAssetsFromCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const assets = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const asset: any = {};
            
            headers.forEach((header, index) => {
              const cleanHeader = header.trim().toLowerCase().replace(' ', '_');
              let value = values[index]?.replace(/"/g, '').trim();
              
              asset[cleanHeader] = value || '';
            });
            
            return asset;
          });
          
        resolve(assets);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
