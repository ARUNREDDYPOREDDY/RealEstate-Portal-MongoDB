// Simple test script: register a test user, login as bootstrap admin, call /api/admin/promote
const http = require('http');

const API_HOST = 'localhost';
const API_PORT = process.env.PORT || 5001;

function req(path, method='GET', body=null, headers={}){
  return new Promise((resolve,reject)=>{
    const opts = { hostname: API_HOST, port: API_PORT, path, method, headers };
    const r = http.request(opts, (res)=>{
      let data=''; res.on('data',c=>data+=c); res.on('end',()=>{
        try{ const json = JSON.parse(data||'{}'); resolve({status:res.statusCode, body:json}); }
        catch(e){ resolve({status:res.statusCode, body:data}); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function run(){
  try{
    console.log('1) Registering test user...');
    const userEmail = 'testuser@local';
    const userPass = 'Testpass123';
    const reg = await req('/api/auth/register','POST',{ first_name:'Test', last_name:'User', email:userEmail, phone:'000', password:userPass }, { 'Content-Type':'application/json' });
    console.log(' register ->', reg.status, reg.body && reg.body.message ? reg.body.message : reg.body);

    console.log('2) Logging in as admin...');
    const adminEmail = process.env.CREATE_ADMIN_EMAIL || 'bootstrap_admin@local';
    const adminPass = process.env.CREATE_ADMIN_PASS || 'AdminPass123';
    const login = await req('/api/auth/login','POST',{ email: adminEmail, password: adminPass }, { 'Content-Type':'application/json' });
    console.log(' login ->', login.status, login.body && login.body.message ? login.body.message : login.body);
    if (!login.body || !login.body.token) { console.error('Admin login failed; cannot continue'); process.exit(1); }
    const token = login.body.token;

    console.log('3) Calling /api/admin/promote to promote test user...');
    const promote = await req('/api/admin/promote','POST',{ email: userEmail }, { 'Content-Type':'application/json', 'Authorization': 'Bearer '+token });
    console.log(' promote ->', promote.status, promote.body);

    console.log('\n✅ Test complete');
    process.exit(0);
  }catch(err){ console.error('❌ testPromote error:', err); process.exit(1); }
}

run();
