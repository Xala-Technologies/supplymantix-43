
export const exportRequestsToCSV = (requests: any[]) => {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Priority',
    'Status',
    'Location',
    'Due Date',
    'Estimated Cost',
    'Actual Cost',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...requests.map(request => [
      request.id,
      `"${request.title || ''}"`,
      `"${request.description || ''}"`,
      request.category || '',
      request.priority || '',
      request.status || '',
      `"${request.location || ''}"`,
      request.due_date || '',
      request.estimated_cost || 0,
      request.actual_cost || 0,
      request.created_at || '',
      request.updated_at || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `requests-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const importRequestsFromCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const requests = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const request: any = {};
            
            headers.forEach((header, index) => {
              const cleanHeader = header.trim().toLowerCase().replace(' ', '_');
              let value = values[index]?.replace(/"/g, '').trim();
              
              // Convert specific fields
              if (cleanHeader === 'estimated_cost' || cleanHeader === 'actual_cost') {
                request[cleanHeader] = parseFloat(value) || 0;
              } else {
                // All other fields remain as strings
                request[cleanHeader] = value || '';
              }
            });
            
            return request;
          });
          
        resolve(requests);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
