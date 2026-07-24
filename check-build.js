const { execSync } = require('child_process');
const fs = require('fs');

// Step 1: tsc
try {
  const out = execSync('npx tsc --noEmit 2>&1', {
    maxBuffer: 50 * 1024 * 1024,
    encoding: 'utf-8',
    cwd: process.cwd()
  });
  fs.writeFileSync('tsc-output.txt', out || '(no output)\n');
  fs.writeFileSync('tsc-exit.txt', '0');
} catch (e) {
  fs.writeFileSync('tsc-output.txt', e.stdout || e.message);
  fs.writeFileSync('tsc-exit.txt', String(e.status || 1));
}

// Step 2: vite build
try {
  const out = execSync('npx vite build 2>&1', {
    maxBuffer: 50 * 1024 * 1024,
    encoding: 'utf-8',
    cwd: process.cwd()
  });
  fs.writeFileSync('build-output.txt', out || '(no output)\n');
  fs.writeFileSync('build-exit.txt', '0');
} catch (e) {
  fs.writeFileSync('build-output.txt', e.stdout || e.message);
  fs.writeFileSync('build-exit.txt', String(e.status || 1));
}
