self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// You can evolve this into an offline cache later.
self.addEventListener("fetch", () => {
  // Passthrough for now
});