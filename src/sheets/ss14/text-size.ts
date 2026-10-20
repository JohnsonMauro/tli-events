// Text size of the /ss14/ sheet (A−/A+ in the Reset bar): × the designed size, from as designed (the smallest) up to
// 2×, in 4 even steps (owner, 2026-10-20). play.css multiplies every font by `--fs`; ./play.ts steps it, and an
// inline script in ./PlaySheet.astro applies the saved one before paint.
export const TEXT_SIZES = [1, 1.25, 1.5, 1.75, 2];
export const TEXT_KEY = 'ss14-text-v1';
