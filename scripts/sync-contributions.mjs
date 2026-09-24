// Fetches the live state of each open-source pull request from the GitHub API and writes it to
// src/lib/data/shared/contributions.live.json (git-ignored), which overrides the hand-written values.
// Runs before every build. Offline or rate-limited? It keeps the last file and the build goes on.
import { readFile, writeFile } from 'node:fs/promises';

const src = new URL('../src/lib/data/shared/contributions.ts', import.meta.url);
const out = new URL('../src/lib/data/shared/contributions.live.json', import.meta.url);

const q = `["']?`;
const str = (key) => String.raw`${q}${key}${q}\s*:\s*["']([^"']+)["']`;
const entry = new RegExp(String.raw`${str('id')},\s*${str('owner')},\s*${str('repo')},\s*${q}number${q}\s*:\s*(\d+)`, 'g');

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'joeyoosenbrug.nl-build' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

try {
  const text = await readFile(src, 'utf8');
  const prs = [...text.matchAll(entry)].map(([, id, owner, repo, number]) => ({ id, owner, repo, number: Number(number) }));
  if (!prs.length) throw new Error('no pull requests found in contributions.ts');

  const live = {};
  for (const { id, owner, repo, number } of prs) {
    const [pr, r] = await Promise.all([get(`/repos/${owner}/${repo}/pulls/${number}`), get(`/repos/${owner}/${repo}`)]);
    live[id] = {
      state: pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : 'open',
      title: pr.title,
      additions: pr.additions,
      deletions: pr.deletions,
      files: pr.changed_files,
      stars: r.stargazers_count
    };
  }
  await writeFile(out, JSON.stringify(live, null, 2) + '\n');
  console.log(
    `[sync-contributions] updated ${prs.length} pull requests:`,
    Object.entries(live)
      .map(([k, v]) => `${k}=${v.state}`)
      .join(', ')
  );
} catch (e) {
  console.warn(`[sync-contributions] skipped, using the existing data: ${e.message}`);
}
