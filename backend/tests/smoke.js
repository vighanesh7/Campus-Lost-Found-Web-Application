// API smoke test. Start the server first, then: npm test   (needs Node 18+ for fetch/FormData)
const BASE = process.env.API_URL || 'http://localhost:5000/api';
let pass = 0; let fail = 0;
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} ${ok ? '' : extra}`); };
const call = async (method, url, { token, body, form } = {}) => {
  const headers = {}; if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + url, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  return { status: res.status, json: await res.json().catch(() => ({})) };
};
(async () => {
  const stamp = Date.now();
  let r = await call('POST', '/auth/register', { body: { name: 'Test User', email: `t${stamp}@campus.edu`, password: 'Test@1234', confirmPassword: 'Test@1234', studentId: `T${stamp}`, department: 'BCA', year: 1, phone: '9999999999' } });
  check('register', r.status === 201 && r.json.data?.token);
  r = await call('POST', '/auth/register', { body: { email: 'bad' } }); check('register validation (422)', r.status === 422);
  r = await call('POST', '/auth/login', { body: { email: 'aarav@campus.edu', password: 'wrong' } }); check('bad login (401)', r.status === 401);
  r = await call('POST', '/auth/login', { body: { email: 'aarav@campus.edu', password: 'Student@123' } });
  const token = r.json.data?.token; check('login', !!token);
  r = await call('GET', '/auth/me', { token }); check('me', r.json.data?.user?.email === 'aarav@campus.edu' && !r.json.data.user.password);
  r = await call('GET', '/items'); check('items without token (401)', r.status === 401);
  r = await call('GET', '/items?type=lost&category=electronics&page=1&limit=5', { token }); check('filter items', r.status === 200 && r.json.data.items.every((i) => i.type === 'LOST'));
  r = await call('GET', '/items?search=iphone', { token }); check('search items', r.json.data.totalItems >= 1);
  const form = new FormData();
  Object.entries({ type: 'FOUND', name: 'Black Wallet', categoryId: 8, description: 'Black leather wallet found near the library steps.', location: 'Library', date: new Date().toISOString().slice(0, 10) }).forEach(([k, v]) => form.append(k, v));
  r = await call('POST', '/items', { token, form }); const id = r.json.data?.item?.id; check('create item', r.status === 201 && id);
  r = await call('PATCH', `/items/${id}/status`, { token, body: { status: 'RESOLVED' } }); check('update status', r.status === 200);
  r = await call('POST', `/favorites/${id}`, { token }); check('add favourite', r.status === 201);
  r = await call('GET', '/favorites', { token }); check('list favourites', r.json.data.favorites.length >= 1);
  r = await call('DELETE', `/favorites/${id}`, { token }); check('remove favourite', r.status === 200);
  r = await call('POST', '/messages', { token, body: { recipientId: 3, itemId: 3, message: 'Hi, is this yours?' } }); check('send message', r.status === 201);
  r = await call('GET', '/messages', { token }); check('list conversations', r.json.data.conversations.length >= 1);
  r = await call('GET', '/notifications', { token }); check('notifications', r.status === 200 && Array.isArray(r.json.data.today));
  r = await call('POST', '/reports', { token, body: { itemId: 1, reportType: 'SPAM', reason: 'Looks like spam to me' } }); check('create report', [201, 409].includes(r.status));
  r = await call('GET', '/admin/stats', { token }); check('student blocked from admin (403)', r.status === 403);
  const admin = (await call('POST', '/auth/login', { body: { email: 'admin@campus.edu', password: 'Admin@123' } })).json.data?.token;
  r = await call('GET', '/admin/stats', { token: admin }); check('admin stats', r.status === 200 && r.json.data.totals.total >= 10);
  r = await call('DELETE', `/items/${id}`, { token }); check('delete own item', r.status === 200);
  console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('Is the server running?', e.message); process.exit(1); });
