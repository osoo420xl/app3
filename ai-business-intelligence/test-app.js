const http = require('http');

console.log('Testing AI Business Intelligence App...');

// Test if the app is running
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ App is running on http://localhost:3000`);
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`🔧 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('AI Business Intelligence') || data.includes('Discover Million-Dollar')) {
      console.log('✅ Content looks good - App is working!');
      console.log('🚀 Visit: http://localhost:3000');
      console.log('📱 Dashboard: http://localhost:3000/dashboard');
    } else {
      console.log('⚠️  Content might be missing');
    }
  });
});

req.on('error', (e) => {
  console.log(`❌ Error: ${e.message}`);
  console.log('💡 Make sure to run: npm run dev');
});

req.end();
