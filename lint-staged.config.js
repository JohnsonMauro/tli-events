// Pre-commit checks on staged files (run by .husky/pre-commit with --hide-all --concurrent false:
// unstaged and untracked files are stashed, so the type check sees exactly what is being committed).
export default {
  '*.{js,mjs,ts,astro,css}': ['prettier --write', 'eslint --max-warnings=0 --no-warn-ignored'],
  '*.{json,yml,yaml}': 'prettier --write',
  // Whole-project type check: a function, so it does not receive the file list.
  '*.{ts,astro}': () => 'astro check',
};
