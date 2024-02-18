import { StorePage } from './pages/StorePage.js';
import { SearchPage } from './pages/SearchPage.js';

const API = 'https://comp-4537-lab-4-api.vercel.app';
const ENDPOINT = `${API}/api/definitions/`;

const PAGE_HANDLER_MAP: Record<string, new (api: string) => unknown> = {
  store: StorePage,
  search: SearchPage,
};

class Driver {
  constructor() {
    const path = window.location.pathname;

    // Get the filename from the path.
    let filename = path.split('/').pop() || 'index.html';

    // If the filename does not end with .html, assume it is index.html.
    // This has various assumptions that are required for this logic to work
    // as intended.
    if (!filename.endsWith('.html')) filename += '.html';

    // Remove the .html extension from the filename.
    const page = filename.split('.').slice(0, -1).join('.').toLowerCase();

    // Check that the page name has an associated handler.
    if (!PageNameValidator.validate(page)) throw new Error(`Invalid page name: '${page}'`);

    // Run the handler for the page.
    const PageHandler = PAGE_HANDLER_MAP[page];
    new PageHandler(ENDPOINT);
  }
}

class PageNameValidator {
  static validate(page: string): boolean {
    return PAGE_HANDLER_MAP.hasOwnProperty(page);
  }
}

new Driver();
