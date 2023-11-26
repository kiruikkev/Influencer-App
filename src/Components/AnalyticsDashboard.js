import React from 'react';

const AnalyticsDashboard = () => {

  // Sample data (replace with actual data)
  const socialMediaData = [
    { platform: 'Facebook', hits: 2000, likes: 1200, shares: 100, comments: 150, conversions: 400 },
    { platform: 'Twitter', hits: 1800, likes: 1100, shares: 90, comments: 130, conversions: 350 },
    { platform: 'Instagram', hits: 2500, likes: 2100, shares: 120, comments: 180, conversions: 600 },
    { platform: 'Google', hits: 2200, likes: 1400, shares: 110, comments: 140, conversions: 500 },
    { platform: 'TikTok', hits: 2800, likes: 2500, shares: 140, comments: 200, conversions: 650 },
    { platform: 'YouTube', hits: 2600, likes: 2300, shares: 130, comments: 190, conversions: 620 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Marketing Channel Performance Report</h1>

      {/* ... [Your Previous Content Here] ... */}

      {/* Social Media Campaign Performance */}
      <div>
        <h2>Social Media Campaign Performance</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Platform</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Hits</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Likes</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Shares</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Comments</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Conversions</th>
            </tr>
          </thead>
          <tbody>
            {socialMediaData.map(data => (
              <tr key={data.platform}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{data.platform}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{data.hits}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{data.likes}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{data.shares}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{data.comments}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{data.conversions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
