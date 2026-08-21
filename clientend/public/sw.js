self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Blood Donation";
  const options = {
    body: data.body || "",
    icon: "https://www.cpsmumbai.org/Uploads/2762023161833920.png",
    badge: "https://www.cpsmumbai.org/Uploads/2762023161833920.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
