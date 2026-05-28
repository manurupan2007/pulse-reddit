const { spawn } = require('child_process');

const proc = spawn('npx.cmd', ['devvit', 'publish'], { stdio: ['pipe', 'pipe', 'pipe'], shell: true });

proc.stdout.on('data', (data) => {
  const out = data.toString();
  process.stdout.write(out);
  if (out.includes('What would you like to do?')) {
    // Send Down Arrow, Down Arrow, Enter
    proc.stdin.write('\x1B[B\x1B[B\r');
  }
});

proc.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

proc.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
