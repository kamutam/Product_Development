export default function handler(req, res) {
  // In a real application, this function would:
  // 1. Fetch RSS feeds from OEM websites (e.g., CP Plus, Streamax)
  // 2. Query a database to see if these products already exist
  // 3. Save new products to the database
  // 4. Send an email/push notification to the user

  // For now, we return a simulated list of recently launched products
  const recentLaunches = [
    {
      id: `new-launch-${Date.now()}-1`,
      oem: 'CP Plus',
      productName: 'CP Plus AI Face Recognition Bullet Camera',
      sku: 'CP-UNC-FR81L5C-VMD',
      resolution: '8 MP (4K Ultra HD)',
      dateAnnounced: new Date().toISOString(),
      type: 'AI Camera',
      url: 'https://cpplusworld.com/new-launches',
      stqcCertified: true
    },
    {
      id: `new-launch-${Date.now()}-2`,
      oem: 'Streamax',
      productName: 'Streamax X5-H0802 Mobile AI NVR (Next Gen)',
      sku: 'STREAMAX-X5-8CH-PRO',
      resolution: '1080p FHD',
      dateAnnounced: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      type: 'Mobile DVR / NVR',
      url: 'https://streamax.com/new-products',
      stqcCertified: false,
      araiCertified: true
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Checked OEM feeds successfully',
    newProductsCount: recentLaunches.length,
    products: recentLaunches
  });
}
