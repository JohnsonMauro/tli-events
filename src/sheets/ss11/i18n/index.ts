// Texts of the /ss11/ play sheet (Vorax), one file per language. `en.ts` sets the shape (`Dict`): a language missing
// a key fails `pnpm check`.
import type { Lang } from '../../../lib/i18n';

import { de } from './de';
import { en, type Dict } from './en';
import { es } from './es';
import { fr } from './fr';
import { ja } from './ja';
import { ko } from './ko';
import { pl } from './pl';
import { ptbr } from './pt-br';
import { ru } from './ru';
import { sv } from './sv';
import { vi } from './vi';
import { zh } from './zh';

export type { Dict };
export const DICT: Record<Lang, Dict> = { en, 'pt-br': ptbr, es, ko, ja, zh, ru, de, fr, pl, sv, vi };
