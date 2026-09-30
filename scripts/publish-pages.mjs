import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, cpSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const root = resolve(new URL('../', import.meta.url).pathname);
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore','pipe','inherit'] }).trim();
if (run('git', ['status','--porcelain'])) throw new Error('Commit all source changes before publishing.');
const sha = run('git', ['rev-parse','HEAD']);
const remote = run('git', ['remote','get-url','origin']);
const main = run('git', ['ls-remote','origin','refs/heads/main']).split(/\s+/)[0];
if (sha !== main) throw new Error('HEAD must match the pushed main branch before publishing.');
for (const script of ['test','validate:content','build']) console.log(run('npm', ['run',script]));
const temporary = mkdtempSync(join(tmpdir(), 'hermes-guide-pages-'));
const checkout = join(temporary, 'site');
const existing = run('git', ['ls-remote','origin','refs/heads/gh-pages']);
try {
  if (existing) run('git', ['clone','--single-branch','--branch','gh-pages',remote,checkout], temporary);
  else { run('git', ['init','--initial-branch=gh-pages',checkout], temporary); run('git',['remote','add','origin',remote],checkout); }
  for (const name of readdirSync(checkout)) if (name !== '.git') rmSync(join(checkout,name), { recursive: true, force: true });
  for (const name of readdirSync(join(root,'dist'))) cpSync(join(root,'dist',name),join(checkout,name),{recursive:true});
  writeFileSync(join(checkout,'.nojekyll'),'');
  writeFileSync(join(checkout,'build-info.json'), JSON.stringify({ sourceCommit: sha, builtAt: new Date().toISOString() },null,2)+'\n');
  run('git',['add','--all'],checkout);
  run('git',['commit','-m',`deploy: JARVIS field guide from ${sha.slice(0,12)}`],checkout);
  run('git',['push','origin','HEAD:gh-pages'],checkout);
  const deployed = run('git',['rev-parse','HEAD'],checkout);
  const actual = run('git',['ls-remote','origin','refs/heads/gh-pages'],checkout).split(/\s+/)[0];
  if (deployed !== actual) throw new Error('Deployment branch read-back did not match.');
  console.log(JSON.stringify({ sourceCommit: sha, deploymentCommit: deployed, status: 'pushed; Pages deployment still needs verification' },null,2));
} finally {
  if (existsSync(temporary)) rmSync(temporary,{recursive:true,force:true});
}
