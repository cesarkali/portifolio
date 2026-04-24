// Pure gallery logic — no DOM dependency
// Feature: portfolio-redesign

export const kaliGallery = {
  images: [
    { src: 'assets/1web.png', label: 'Web — Dashboard', type: 'web' },
    { src: 'assets/2web.png', label: 'Web — Transações', type: 'web' },
    { src: 'assets/3web.png', label: 'Web — Relatórios', type: 'web' },
    { src: 'assets/1app.jpg', label: 'Android — Home', type: 'app' },
    { src: 'assets/2app.jpg', label: 'Android — Finn IA', type: 'app' },
    { src: 'assets/3app.jpg', label: 'Android — Contas', type: 'app' },
  ],
  currentIndex: 0,
};

/**
 * Pure factory — no DOM dependency.
 * @param {number} startIdx - Initial index (0–5)
 * @returns {{ images: object[], currentIndex: number, next(): number, prev(): number, openLightbox(idx: number): string }}
 */
export function createGallery(startIdx = 0) {
  const images = kaliGallery.images;
  let currentIndex = startIdx;

  return {
    get images() { return images; },
    get currentIndex() { return currentIndex; },
    next() {
      currentIndex = (currentIndex + 1) % images.length;
      return currentIndex;
    },
    prev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      return currentIndex;
    },
    openLightbox(idx) {
      return images[idx].src;
    },
  };
}
