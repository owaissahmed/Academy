// Chhota pub-sub — foreground notification aane par Home ko turant batane ke liye
const listeners = new Set();

export const notificationEvents = {
    subscribe: (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },
    emit: () => {
        listeners.forEach((cb) => cb());
    },
};