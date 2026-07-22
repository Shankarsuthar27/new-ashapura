import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop — instantly scrolls to (0, 0) on every route change.
 *
 * Watches BOTH `pathname` AND `search` so that:
 *  - /products  → /products?category=Floor+Tiles  (query-string change) triggers scroll
 *  - /           → /products                       (pathname change) also triggers scroll
 *
 * Place this as the first child inside <BrowserRouter>.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
};
