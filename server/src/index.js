'use strict';

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Blog API server running on http://localhost:${PORT}`);
  console.log(`   Health check → GET http://localhost:${PORT}/`);
  console.log(`   Auth routes  → POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`                  POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   Posts routes → GET  http://localhost:${PORT}/api/posts`);
  console.log(`                  POST http://localhost:${PORT}/api/posts  (auth required)\n`);
});
