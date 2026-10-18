// Which commit this build comes from. Each page carries it in <meta name="tli-build">; the update check in
// src/layouts/Base.astro compares it with the live page's and offers a reload when they differ. CI checks out
// the commit it builds (including one just pushed by the data refresh), so HEAD is the right one there too.
import { execFileSync } from 'node:child_process';

function head(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'dev';
  }
}

export const BUILD_ID = head();
