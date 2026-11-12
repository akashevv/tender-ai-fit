import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** On in-app navigation: scroll to the top and move focus to <main> so keyboard and
 *  screen-reader users start at the new page content. The first load is skipped so the
 *  "Skip to main content" link stays the first Tab stop. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) return;
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
