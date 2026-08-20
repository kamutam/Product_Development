import Papa from 'papaparse';

export const fetchProcurementData = async () => {
  try {
    const response = await fetch('/purchase_orders.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Forward-fill parent PO fields for multi-item PO rows
          let currentPO = {
            id: '',
            supplier: '',
            supplierName: '',
            date: '',
            status: '',
            company: ''
          };

          const normalized = results.data.map(row => {
            if (row['ID'] && String(row['ID']).trim() !== '') {
              currentPO = {
                id: row['ID'],
                supplier: row['Supplier'],
                supplierName: row['Supplier Name'],
                date: row['Date'],
                status: row['Status'],
                company: row['Company']
              };
            }

            return {
              ...row,
              'ID': row['ID'] || currentPO.id,
              'Supplier': row['Supplier'] || currentPO.supplier,
              'Supplier Name': row['Supplier Name'] || currentPO.supplierName,
              'Date': row['Date'] || currentPO.date,
              'Status': row['Status'] || currentPO.status,
              'Company': row['Company'] || currentPO.company
            };
          });

          resolve(normalized);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching procurement data:', error);
    return [];
  }
};

export const getSupplierAnalytics = (poData) => {
  const analytics = {};
  poData.forEach(row => {
    // If supplier name is blank but we have one in 'Supplier' col
    const supplier = row['Supplier Name'] || row['Supplier'];
    if (!supplier || supplier.trim() === '') return;
    
    if (!analytics[supplier]) {
      analytics[supplier] = {
        name: supplier,
        totalOrders: 0,
        totalSpend: 0,
        completedOrders: 0,
        pendingOrders: 0
      };
    }
    
    const amount = Number(row['Amount (Company Currency) (Items)']) || 0;
    analytics[supplier].totalSpend += amount;
    
    const status = row['Status'] || '';
    if (status === 'Completed') {
      analytics[supplier].completedOrders += 1;
    } else {
      analytics[supplier].pendingOrders += 1;
    }
    analytics[supplier].totalOrders += 1;
  });
  
  return Object.values(analytics).sort((a, b) => b.totalSpend - a.totalSpend);
};

export const getHistoricalPricesForItem = (poData, query) => {
  if (!query) return [];
  const q = query.toLowerCase();
  
  return poData.filter(row => {
    const itemName = String(row['Item Name (Items)'] || '').toLowerCase();
    const itemCode = String(row['Item Code (Items)'] || '').toLowerCase();
    return itemName.includes(q) || itemCode.includes(q);
  }).map(row => ({
    date: row['Date'],
    supplier: row['Supplier Name'] || row['Supplier'],
    itemName: row['Item Name (Items)'],
    quantity: row['Quantity (Items)'],
    rate: row['Rate (Company Currency) (Items)'],
    amount: row['Amount (Company Currency) (Items)'],
    status: row['Status']
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
};
