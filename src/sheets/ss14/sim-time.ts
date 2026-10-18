// When our engine's numbers were last published: the commit that last changed engine_results.json, read at
// build time (`git log`, ISO 8601 — the owner runs `tartarus export` and commits it). The export itself only
// records a UTC date (`generated`), which can't tell the run's day in another zone. Read once per build, shared
// by every language's page.
import { execFileSync } from 'node:child_process';

const FILE = 'events/SS14_Tartarus/data/engine_results.json';

export interface SimTime {
  /** The commit instant, e.g. 2026-10-17T21:24:13-03:00. */
  iso: string;
}

function read(): SimTime | null {
  try {
    const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
    // A shallow clone dates every file by its one commit (CI checks out with fetch-depth: 0); an uncommitted
    // export isn't in the log yet. Both fall back to the export's UTC date.
    if (git('rev-parse', '--is-shallow-repository') === 'true') return null;
    if (git('status', '--porcelain', '--', FILE)) return null;
    const iso = git('log', '-1', '--format=%cI', '--', FILE);
    if (Number.isNaN(Date.parse(iso))) return null;
    return { iso };
  } catch {
    return null;
  }
}

export const SIM_TIME = read();
