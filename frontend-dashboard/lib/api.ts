/**
 * API Client for Dashboard Backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';

export const api = {
    // Base fetch with proper error handling
    async fetch(endpoint: string, options?: RequestInit) {
        const url = `${API_URL}${endpoint}`;
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    // Health check
    health: () => api.fetch('/api/health'),

    // Agent endpoints
    agents: {
        status: () => api.fetch('/api/agents/status'),
        secretsStatus: () => api.fetch('/api/agents/secrets-status'),
        start: (agent: string, params?: any) =>
            api.fetch(`/api/agents/start/${agent}`, {
                method: 'POST',
                body: params ? JSON.stringify({ params }) : undefined
            }),
        stop: (agent: string) => api.fetch(`/api/agents/stop/${agent}`, { method: 'POST' }),
        stopAll: () => api.fetch('/api/agents/stop-all', { method: 'POST' }),
    },

    // Logs
    logs: {
        get: (limit = 100) => api.fetch(`/api/logs?limit=${limit}`),
        clear: () => api.fetch('/api/logs/clear', { method: 'POST' }),
    },

    // Activity
    activity: {
        get: () => api.fetch('/api/activity'),
    },

    // Leads
    leads: {
        list: (limit = 100, offset = 0) => api.fetch(`/api/leads?limit=${limit}&offset=${offset}`),
        stats: () => api.fetch('/api/leads/stats'),
        kanban: () => api.fetch('/api/leads/kanban'),
        updateStatus: (leadId: number, status: string, column: string) =>
            api.fetch('/api/leads/kanban', {
                method: 'POST',
                body: JSON.stringify({ leadId, status, column }),
            }),
    },

    // Connections
    connections: {
        get: () => api.fetch('/api/connections'),
    },

    // Charts
    charts: {
        weekly: () => api.fetch('/api/charts/weekly'),
    },

    // Intelligence
    intelligence: {
        analyzeProfile: (url: string) => api.fetch('/api/analytics/analyze-profile', {
            method: 'POST',
            body: JSON.stringify({ url })
        }),
    },

    // Campaigns
    campaigns: {
        list: () => api.fetch('/api/campaigns'),
        create: (data: any) => api.fetch('/api/campaigns', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Settings
    settings: {
        get: () => api.fetch('/api/settings'),
        update: (data: any) => api.fetch('/api/settings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        saveSafety: (data: any) => api.fetch('/api/settings/safety', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },
};

// WebSocket connection helper
export function createWebSocket(path: string) {
    return new WebSocket(`${WS_URL}${path}`);
}

export { API_URL, WS_URL };
