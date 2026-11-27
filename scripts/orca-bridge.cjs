#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function taskFor(plan, id) {
  const task = plan.tasks?.find(t => t.id === id);
  if (!task || !plan.approvedIds?.includes(id)) throw new Error('Story is not approved: ' + id);
  if (!task.summary || task.approvedSummary !== task.summary) throw new Error('Changed or missing approved summary: ' + id);
  if (!task.prompt || !task.nodeId) throw new Error('Missing prepared prompt/node association: ' + id);
  return task;
}
function main(argv) {
  const [planFile, operation, ...rest] = argv;
  if (!planFile || !operation) throw new Error('Usage: node orca-bridge.cjs PLAN fill-task|submit-task|call ...');
  const plan = JSON.parse(fs.readFileSync(planFile, 'utf8').replace(/^\uFEFF/, ''));
  if (!plan.pageId || !plan.url || !plan.orcaExecutable) throw new Error('Bind pageId, exact url and resolved orcaExecutable first');
  const ledgerFile = path.resolve(planFile) + '.ledger.json';
  const ledger = fs.existsSync(ledgerFile) ? JSON.parse(fs.readFileSync(ledgerFile, 'utf8')) : {};
  const save = () => {
    const tmp = ledgerFile + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2), 'utf8');
    fs.renameSync(tmp, ledgerFile);
  };
  let args, task;
  if (operation === 'fill-task' || operation === 'submit-task') {
    const [id, ref] = rest;
    task = taskFor(plan, id);
    if (!/^@e\d+$/.test(ref || '')) throw new Error('Use a fresh observed element ref');
    if (ledger[id]?.submissionRequestedAt) throw new Error('Already submitted or uncertain; inspect existing node, do not resend: ' + id);
    args = [operation === 'fill-task' ? 'fill' : 'click', '--page', plan.pageId, '--expect-url', plan.url, '--element', ref];
    if (operation === 'fill-task') args.push('--value', task.prompt);
    else {
      const scopedSelector = '[data-id=' + JSON.stringify(task.nodeId) + ']';
      const observed = spawnSync(plan.orcaExecutable, ['snapshot', '--page', plan.pageId, '--selector', scopedSelector, '--interactive', '--compact', '--json'], { encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024, timeout: 45000 });
      let scoped;
      try { scoped = JSON.parse(observed.stdout || ''); } catch { throw new Error('Could not verify the intended output node; nothing submitted'); }
      const control = scoped.result?.refs?.[ref.slice(1)];
      if (!scoped.ok || observed.status !== 0 || control?.role !== 'button' || control?.name !== '生成' || /button [^\n]*生成[^\n]*disabled/.test(scoped.result?.snapshot || '')) throw new Error('Generate ref is not an enabled control of the intended output node; nothing submitted');
      ledger[id] = { nodeId: task.nodeId, status: 'submission-requested', submissionRequestedAt: new Date().toISOString() };
      save();
    }
  } else if (operation === 'call') {
    const [command, ...options] = rest;
    if (!command) throw new Error('Missing documented Orca page command');
    if (options.includes('--page')) throw new Error('Plan owns page binding');
    args = [command, '--page', plan.pageId, ...options];
    if (['fill','click','type','keypress','select','check','upload','focus','hover'].includes(command) && !options.includes('--expect-url')) args.push('--expect-url', plan.url);
  } else throw new Error('Unknown bridge operation');
  const run = spawnSync(plan.orcaExecutable, [...args, '--json'], { encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024, timeout: 45000 });
  let receipt;
  try { receipt = JSON.parse(run.stdout || ''); }
  catch {
    if (operation === 'submit-task') { ledger[task.id].status = 'uncertain'; save(); }
    throw new Error('Unknown command outcome; inspect existing node. ' + (run.error?.message || run.stderr || 'No JSON receipt'));
  }
  if (operation === 'submit-task') {
    ledger[task.id].status = receipt.ok ? 'submission-requested' : 'uncertain';
    save();
  }
  if (!receipt.ok || run.status !== 0) throw new Error(JSON.stringify(receipt.error || { message: 'Command did not finish successfully' }));
  const r = receipt.result || {};
  const p = r.effects?.page;
  const lines = typeof p === 'object' ? p.lines || [] : [];
  const summary = { ok: true, operation, task: task?.id, nodeId: task?.nodeId, settled: r.effects?.settled, notices: lines.filter(s => /生成中|校验|排队|失败|错误|完成|disabled|Seedance|480p|720p|1080p|\d+s/.test(s) && s.length < 240).slice(-12) };
  if (typeof r.snapshot === 'string') summary.controls = r.snapshot.split('\n').filter(s => /button|editable|textbox|radio|spinbutton/.test(s)).map(s => s.slice(0,220)).slice(-30);
  if (r.result !== undefined) summary.result = r.result;
  if (r.effects?.page?.truncated) summary.pageTruncated = true;
  console.log(JSON.stringify(summary));
}
if (require.main === module) { try { main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; } }
module.exports = { taskFor };
