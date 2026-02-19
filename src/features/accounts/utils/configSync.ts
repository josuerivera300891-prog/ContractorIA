/**
 * Synchronizes language and theme settings with shared storage or Cockpit Tools.
 */
export const configSync = {
    SYNC_KEY: "contractoria_offline_config",

    sync(config: { locale: string; theme: string }) {
        localStorage.setItem(this.SYNC_KEY, JSON.stringify(config));

        // Dispatch a custom event so other components or tools can listen for changes
        window.dispatchEvent(new CustomEvent('contractoria_config_sync', { detail: config }));
    },

    getStoredConfig() {
        const raw = localStorage.getItem(this.SYNC_KEY);
        return raw ? JSON.parse(raw) : null;
    }
};
