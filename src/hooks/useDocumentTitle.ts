import { useEffect } from "react";

/**
 * Lightweight document title/description setter for the client-side SPA.
 * Replaces TanStack Router's head() metadata in a static, no-SSR build.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
