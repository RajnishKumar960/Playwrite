import { create } from 'zustand';
import { api } from './api';

type AgentStatus = 'stopped' | 'running' | 'paused';

interface AgentState {
    agentStatus: Record<string, AgentStatus>;
    logs: Array<{
        id: string;
        timestamp: string;
        message: string;
        type: 'info' | 'success' | 'error' | 'warning';
        agent: string;
    }>;
    stats: {
        leadsProcessed: number;
        connectionsSent: number;
        connectionsAccepted: number;
        postsEngaged: number;
        successRate: number;
    };
    isConnected: boolean;

    setAgentStatus: (agent: string, status: AgentStatus) => void;
    addLog: (message: string, type: 'info' | 'success' | 'error' | 'warning', agent: string) => void;
    clearLogs: () => void;
    updateStats: (stats: Partial<AgentState['stats']>) => void;
    setConnected: (connected: boolean) => void;
    startAgent: (agent: string) => Promise<void>;
    stopAgent: (agent: string) => Promise<void>;
    stopAllAgents: () => Promise<void>;
    syncLogs: () => Promise<void>;
    syncStatus: () => Promise<void>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
    agentStatus: {
        feedWarmer: 'stopped',
        leadCampaign: 'stopped',
        connectionChecker: 'stopped',
        allAgents: 'stopped',
    },
    logs: [],
    stats: {
        leadsProcessed: 0,
        connectionsSent: 0,
        connectionsAccepted: 0,
        postsEngaged: 0,
        successRate: 0,
    },
    isConnected: false,

    setAgentStatus: (agent, status) =>
        set((state) => ({
            agentStatus: { ...state.agentStatus, [agent]: status },
        })),

    addLog: (message, type, agent) =>
        set((state) => ({
            logs: [
                {
                    id: Date.now().toString(),
                    timestamp: new Date().toLocaleTimeString(),
                    message,
                    type,
                    agent,
                },
                ...state.logs,
            ].slice(0, 100),
        })),

    clearLogs: () => set({ logs: [] }),

    updateStats: (newStats) =>
        set((state) => ({
            stats: { ...state.stats, ...newStats },
        })),

    setConnected: (connected) => set({ isConnected: connected }),

    startAgent: async (agent) => {
        try {
            await api.agents.start(agent);
            set((state) => ({
                agentStatus: { ...state.agentStatus, [agent]: 'running' },
            }));
            get().addLog(`${agent} started`, 'success', agent);
        } catch (error) {
            get().addLog(`Failed to start ${agent}`, 'error', 'system');
        }
    },

    stopAgent: async (agent) => {
        try {
            await api.agents.stop(agent);
            set((state) => ({
                agentStatus: { ...state.agentStatus, [agent]: 'stopped' },
            }));
            get().addLog(`${agent} stopped`, 'info', agent);
        } catch (error) {
            get().addLog(`Failed to stop ${agent}`, 'error', 'system');
        }
    },

    stopAllAgents: async () => {
        try {
            await api.agents.stopAll();
            set({
                agentStatus: {
                    feedWarmer: 'stopped',
                    leadCampaign: 'stopped',
                    connectionChecker: 'stopped',
                    allAgents: 'stopped',
                },
            });
            get().addLog('All agents stopped', 'warning', 'system');
        } catch (error) {
            get().addLog('Failed to stop agents', 'error', 'system');
        }
    },

    syncLogs: async () => {
        try {
            const data = await api.logs.get(100);
            if (data.logs) {
                set({ logs: data.logs });
            }
        } catch {
            // Ignore sync errors
        }
    },

    syncStatus: async () => {
        try {
            const data = await api.agents.status();
            set({
                agentStatus: data.agents || get().agentStatus,
                isConnected: true,
            });
        } catch {
            set({ isConnected: false });
        }
    },
}));
