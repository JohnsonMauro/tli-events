import { getImage } from 'astro:assets';

/** Attributes for an `<img>`: optimized WebP + srcset, and intrinsic width/height so the box is reserved before load. */
export interface Img { src: string; srcset: string; width: number; height: number }

type Glob = Record<string, { default: ImageMetadata }>;

/**
 * An image drawn in a box `box` CSS px wide: WebP at 1× and 2× that width, never above the original.
 * width/height are the 1× size (the CSS sets the real box; these only give the browser the aspect ratio).
 */
export async function fixed(meta: ImageMetadata, box: number): Promise<Img> {
  const width = Math.min(meta.width, box);
  const r = await getImage({ src: meta, width, densities: [1, 2], format: 'webp' });
  return { src: r.src, srcset: r.srcSet.attribute, width, height: Math.round((meta.height * width) / meta.width) };
}

/** An image that fills a fluid box: WebP at several widths (never above the original); pair with a `sizes` attribute. */
export async function fluid(meta: ImageMetadata, widths: number[]): Promise<Img> {
  const ws = widths.filter((w) => w <= meta.width);
  if (!ws.length) ws.push(meta.width);
  const width = Math.max(...ws);
  // `width` makes the plain src one of the srcset files instead of a full-size copy.
  const r = await getImage({ src: meta, width, widths: ws, format: 'webp' });
  return { src: r.src, srcset: r.srcSet.attribute, width, height: Math.round((meta.height * width) / meta.width) };
}

/** Index an `import.meta.glob(..., { eager: true })` of images by file name without extension. */
export const byName = (files: Glob): Record<string, ImageMetadata> =>
  Object.fromEntries(Object.entries(files).map(([path, mod]) => [(path.split('/').pop() ?? path).replace(/\.\w+$/, ''), mod.default]));

/**
 * Art lookup at a few box sizes: `art(id, 'sm')` → a promise of the optimized image, or null when there is no such art
 * (decided synchronously, so `art(id) ? <Art img={art(id)} /> : placeholder` works). Only variants actually used are generated.
 * Sizes are the CSS box widths used by the sheets (icons ~44 px, step art 72 px, instrument tiles/popover ≤128 px).
 */
export const ART_BOX = { sm: 52, md: 80, lg: 128 } as const;
export type ArtSize = keyof typeof ART_BOX;

export function artSet(files: Glob) {
  const metas = byName(files);
  const memo = new Map<string, Promise<Img>>();
  return (id: string, size: ArtSize = 'sm'): Promise<Img> | null => {
    const meta = metas[id];
    if (!meta) return null;
    const key = `${id}:${size}`;
    let img = memo.get(key);
    if (!img) memo.set(key, (img = fixed(meta, ART_BOX[size])));
    return img;
  };
}
