import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('-------------------------------------------------------------');
console.log('🚀 Starting PharmaPrint Full-Stack Anti-Counterfeit Platform');
console.log('   - Frontend Client:  http://localhost:3000');
console.log('   - Backend Server:   http://localhost:5001');
console.log('-------------------------------------------------------------');

// Start Express Backend
const server = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start Vite Client
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
});
