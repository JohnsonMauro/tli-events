// Project-wide links and the site version. The feedback button on every event page points here.
import { version } from '../../package.json';

export const REPO_URL = 'https://github.com/JohnsonMauro/tli-events';
/** Site version (package.json, same as the git tag vX.Y.Z); the footer links it to the changelog. */
export const VERSION = version;
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
export const DISCUSSIONS_URL = `${REPO_URL}/discussions`;
