import { spawn } from 'child_process';
import { readFileSync } from 'fs';

// Test the MCP server by spawning it and sending a list tools request
const child = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    SMS_ACTIVATE_API_KEY: process.env.SMS_ACTIVATE_API_KEY || 'test_api_key'
  }
});

// Send a JSON-RPC request to list tools
const request = {
  jsonrpc: '2.0',
  method: 'tools/list',
  id: 1,
  params: {}
};

child.stdin.write(JSON.stringify(request) + '\n');

let output = '';
child.stdout.on('data', (data) => {
  output += data.toString();
  console.log('Server output:', data.toString());
});

child.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});

child.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Give the server a moment to respond, then close
setTimeout(() => {
  child.stdin.end();
}, 2000);