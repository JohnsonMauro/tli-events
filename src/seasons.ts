export interface Season {
  slug: string;
  dir: string;
  code: string;
  name: string;
  nameCn: string;
  mechanic: string;
  launched: string;
  summary: string;
  guideId: string;
  changelogId: string;
}

export const SEASONS: Season[] = [
  {
    slug: 'ss14',
    dir: 'SS14_Tartarus',
    code: 'SS14',
    name: 'Tartarus',
    nameCn: '塔罗斯的困兽',
    mechanic: "Warden's Duty — a 16-cell prison",
    launched: '2026-10-15',
    summary: '20 days to raise inmates to Rainbow; the riot turns the board into Warden’s Caches.',
    guideId: 'SS14_Tartarus/TARTARUS_GUIDE',
    changelogId: 'SS14_Tartarus/CHANGELOG',
  },
];

export const bySlug = (slug: string) => SEASONS.find((s) => s.slug === slug);

/** Prefix an internal path with the deploy base (GitHub Pages project path). */
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
