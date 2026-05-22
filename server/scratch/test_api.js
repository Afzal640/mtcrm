

async function test() {
  const baseUrl = 'http://localhost:5000/api';
  const email = `testuser_${Date.now()}@example.com`;
  
  console.log('Testing Registration...');
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: email,
      password: 'password123',
      role: 'admin'
    })
  });
  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  console.log('Registration Data:', regData);

  if (regRes.status !== 200) return;

  console.log('\nTesting Login...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: 'password123'
    })
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status);
  console.log('Login Data:', loginData);

  if (loginRes.status === 200) {
    const token = loginData.token;
    console.log('\nTesting Protected Admin Route...');
    const adminRes = await fetch(`${baseUrl}/admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const adminData = await adminRes.json();
    console.log('Admin Route Status:', adminRes.status);
    console.log('Admin Route Data:', adminData);
  }
}

test();
