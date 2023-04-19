self.addEventListener('install', event => {
    console.log('Service worker installed');
});

self.addEventListener('activate', event => {
    console.log('Service worker activated');
});

self.addEventListener('push', event => {
    console.log('Service worker received a push event');

    const data = event.data.json();
    const options = {
        body: data.body,
        time: data.time
    };
    self.setTimeout(() => {
        notifica();
    }, 3000);
});

function notifica() {
    console.log("notifica ritardata");
}

self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://example.com/appointments')
    );
});