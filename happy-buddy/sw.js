/* Happy Buddy service worker — offline cache for iPad / PWA */
const CACHE = "happy-buddy-v1";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/animals/bunny.svg",
  "./assets/animals/cat.svg",
  "./assets/animals/dog.svg",
  "./assets/animals/pig.svg",
  "./assets/animals/shark.svg",
  "./assets/animals/bear.svg",
  "./assets/music/soft-lullaby.wav",
  "./assets/music/soft-playful.wav",
  "./assets/music/soft-dreamy.wav",
  "./assets/music/soft-sunny.wav",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok && url.protocol.startsWith("http")) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);

      // Prefer network for HTML; cache-first for assets
      if (req.mode === "navigate" || req.destination === "document") {
        return network.then((res) => res || cached || caches.match("./index.html"));
      }
      return cached || network;
    })
  );
});
