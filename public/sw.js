// Minimale service worker, alleen voor Web Push — geen offline-caching (die
// complexiteit is hier niet nodig, dit dient uitsluitend om pushnotificaties
// te kunnen tonen terwijl de app niet open is).

self.addEventListener("push", (event) => {
  let data = { title: "Geloof je dat ook?", body: "", url: "/" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // negeer onverwachte payload-vorm, val terug op de defaults hierboven
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
