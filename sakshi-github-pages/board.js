'use strict';
if (!['/', '/index.html'].includes(location.pathname)) {
  location.replace(/^\/cv\/?$/.test(location.pathname) ? '/cv/index.html' : '/404.html');
}
const $ = selector => document.querySelector(selector);
const drawer = $('#drawer');
const note = $('#closed-file');
const all = new Set([...files.map(f => f.answer), 'MARGINALIA', 'INSPECTOR', 'PAPERTRAIL', 'TRIPWIRE']);
const key = 'sakshi-ctf-flags-v1';
function saved() {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data.filter(x => all.has(x)) : [];
  } catch { return []; }
}
const found = new Set(saved());
console.info('You opened the console. I left a flag here for whoever checked. SK{INSPECTOR}');
function refresh() {
  $('#count').textContent = 'Flags found: ' + found.size + ' / 25';
  $('.meter i').style.width = found.size * 4 + '%';
  files.forEach(file => {
    if (!found.has(file.answer)) return;
    const footer = document.querySelector('[data-id="' + file.id + '"] .tilefoot');
    if (!footer.querySelector('.stamp')) footer.innerHTML = '<span class="stamp">SOLVED</span><b>↗</b>';
  });
  note.hidden = found.size !== all.size;
}
function award(value, output, specific) {
  const text = value.trim().toUpperCase();
  const answer = text.replace(/^SK\{([^{}]+)\}$/, '$1');
  if (!all.has(answer) || (specific && answer !== specific)) {
    output.textContent = 'No match. Check the clue and try again.';
    return;
  }
  saved().forEach(x => found.add(x));
  const complete = found.size === all.size;
  const repeat = found.has(answer);
  found.add(answer);
  try { localStorage.setItem(key, JSON.stringify([...found])); } catch {}
  refresh();
  output.textContent = repeat ? 'Already filed. SK{' + answer + '}' : 'Flag found! SK{' + answer + '}';
  if (!complete && !note.hidden) {
    location.hash = 'closed-file';
    note.setAttribute('tabindex','-1');
    requestAnimationFrame(() => {note.focus(); note.scrollIntoView();});
  }
}
const annotations = {
  TRUST: 'from triage to a threat hunt',
  EVIDENCE: 'the manual step that started it',
  RACI: 'who owns each piece of evidence?',
  EQUAL: 'same budget for all five',
  AWS: 'two sides of the placement',
  ROLE: 'check the role before granting access',
  SQLITE: 'follow one request to the database',
  RETEM: 'starts with real smart meter data',
  RECIPE: 'built in six hours',
  PCA: 'one letter at a time',
  INVOICE: 'assessed by the musician using it',
  FINTECH: 'AI, FinTech and digital finance',
  VOTE: 'representing 1,500+ students',
  BUDGET: 'four societies, one workshop',
  SELSA: 'a competitively selected place',
  CHAMPION: 'after graduation: the Champions programme',
  MQ: 'security, data, AI and messaging',
  '11': 'SheffJam XI: Best Newcomer',
  UBUNTU: 'one branch of the skills index'
};
function fileReceipt(file) {
  const receipt = $('#receipt');
  receipt.replaceChildren();
  if (!found.has(file.answer)) return;
  const stamp = document.createElement('span');
  stamp.className = 'stamp';
  stamp.textContent = 'SOLVED';
  const progress = document.createElement('span');
  progress.textContent = found.size + ' of 25 flags filed';
  receipt.append(stamp, progress);
  const index = files.indexOf(file);
  const ordered = [...files.slice(index + 1), ...files.slice(0, index)];
  const next = ordered.find(item => !found.has(item.answer));
  const link = document.createElement('a');
  link.href = next ? '#file/' + next.id : '#board';
  link.textContent = next ? 'Next file · ' + next.name : 'Back to the board';
  receipt.append(link);
}
function diagram(file) {
  if (!file.diagram) return '';
  const labels = file.diagram.split('|');
  const parallel = ['Fujitsu work experience','Foundations and credentials','Awards and invitations'].includes(file.name);
  const merge = file.name === 'Forest fire cellular automaton';
  const boxes = labels.map((label,i) => {
    const x = 5 + i*149;
    const lines = [''];
    for (const word of label.split(' ')) {
      const last = lines.length - 1;
      const joined = (lines[last] + ' ' + word).trim();
      if (lines[last] && joined.length > 15) lines.push(word);
      else lines[last] = joined;
    }
    const textLines = lines.map((line, row) => {
      const y = 25 + (row - (lines.length - 1) / 2) * 14;
      return '<tspan x="63" y="' + y + '">' + line + '</tspan>';
    }).join('');
    return '<g transform="translate('+x+' 23) rotate('+[-1,1,-1][i]+' 64 20)"><path d="M2 2 125 0 127 40 0 42Z" fill="#eae7d9" stroke="currentColor"/><text text-anchor="middle" font-size="12" font-family="monospace">'+textLines+'</text></g>';
  }).join('');
  if (merge) return '<figure><svg viewBox="0 0 440 100" role="img" aria-label="Ignition probability and wind bias both feed the fire simulation"><g fill="#eae7d9" stroke="currentColor"><path d="m5 4 153 1-1 30H4zM5 57l152 1v31H5zM263 28l157 1-1 39H262z"/><path d="m157 19 98 29-98 24m88-32 11 8-11 7" fill="none"/></g><g font-size="14" font-family="monospace"><text x="81" y="17" text-anchor="middle"><tspan x="81">Ignition</tspan><tspan x="81" dy="14">probability</tspan></text><text x="18" y="79">Wind bias</text><text x="278" y="54">Fire simulation</text></g></svg></figure>';
  const arrows = parallel ? '' : '<path d="M133 44h18m-5-4 5 4-5 4M282 44h18m-5-4 5 4-5 4" stroke="currentColor" fill="none"/>';
  const noteText = annotations[file.answer];
  return '<figure><svg viewBox="0 0 440 90" role="img" aria-label="'+labels.join(parallel ? ', ' : ' then ')+'">'+boxes+arrows+'<text x="8" y="84" font-family="Georgia,serif" font-size="14" font-style="italic">'+noteText+'</text></svg></figure>';
}
let origin = null;
function closeFile() {location.hash = 'board';}
function route() {
  const id = location.hash.slice(1);
  if (id === 'people') { location.replace('#leadership-outreach'); return; }
  if (!id.startsWith('file/')) {
    if (drawer.open) { drawer.close(); if (origin && id === 'board') origin.focus({preventScroll:true}); }
    return;
  }
  const f = files.find(item => 'file/'+item.id === id);
  if (!f) {location.replace('/404.html');return;}
  drawer.dataset.section = f.code.slice(0, 3);
  origin = document.querySelector('[data-id="'+f.id+'"]');
  const hidden = ['EVIDENCE','INVOICE','ETHICS'].includes(f.answer);
  $('#filebody').innerHTML = '<span class="tab">'+f.code+' / '+f.cat+'</span><h2>'+f.name+'</h2><small>'+f.pts+' pts'+(f.name==='Dissertation'?' · IN PROGRESS':'')+'</small>'+diagram(f)+
    [['The problem',f.problem],['What I did',f.work],['What I learned',f.learn||'Personal reflection pending.'],['Tools used',f.tool||'No specific tools listed.']].filter(([,content]) => content).map(([heading,content]) => '<h3>'+heading+'</h3><p>'+content+'</p>').join('')+
    (f.link?'<a href="'+f.link+'">Project repository</a>':'<small>[PROJECT LINK]</small>')+
    '<details><summary>Optional puzzle · Find the flag</summary><p>'+f.clue+'</p>'+(hidden?'<button class="redact" aria-label="Reveal the hidden word">'+f.answer+'</button>':'')+
    '<form id="puzzle"><label for="answer">Answer word or SK{…}</label><div class="inputrow"><input required maxlength="80" id="answer" placeholder="SK{…}"><button>File flag</button></div><output></output></form></details><div id="receipt" aria-live="polite"></div>';
  $('#puzzle').onsubmit = event => {event.preventDefault();award($('#answer').value,$('#puzzle output'),f.answer);fileReceipt(f);};
  fileReceipt(f);
  if (!drawer.open) drawer.showModal();
  else $('.close').focus({preventScroll:true});
  drawer.scrollTop = 0;
}
$('.close').onclick = closeFile;
drawer.oncancel = event => {event.preventDefault();closeFile();};
drawer.onclick = event => {if(event.target===drawer && event.clientX<drawer.getBoundingClientRect().left) closeFile();};
window.addEventListener('hashchange',route);
window.addEventListener('storage',event => {if(event.key===key){saved().forEach(x=>found.add(x));refresh();}});
document.addEventListener('click',event=>{
  if (event.target.matches('.redact')) {
    event.target.classList.add('revealed');
    if(event.target.closest('#about') && !$('#about .stamp')) {
      const stamp=document.createElement('span');stamp.className='stamp';stamp.textContent='DECLASSIFIED';$('#about').append(' ',stamp);
    }
  }
});
for(const ev of ['pointerover','focusin']) $('#about').addEventListener(ev,e=>{if(e.target.matches('.redact'))e.target.click();});
$('#global').onsubmit = event => {event.preventDefault();award($('#flag').value,$('#global output'));};
$('#trap').onsubmit = event => {
  event.preventDefault();
  const q = $('#query').value;
  const out = $('#trap output');
  const match = /<\s*(?:script|img|svg)\b|\bon(?:error|load)\s*=|\bunion\s+(?:all\s+)?select\b|['"]?\s*\bor\s+(?:['"][^'"]*['"]|\d+)\s*=|['"]\s*;?\s*--/i.test(q);
  if(match){award('TRIPWIRE',out);out.textContent='You found the tripwire. Stamp this one solved. SK{TRIPWIRE}';}
  else out.textContent='No tripwire triggered. Try another search.';
};
refresh();route();
