import api from '@/config/api';

export const copilotService = {
  chat: (message: string, sessionId?: number) =>
    api.post('/copilot/chat', { message, session_id: sessionId }).then(r => r.data.data),
  getSessions: () => api.get('/copilot/sessions').then(r => r.data.data),
  getMessages: (sessionId: number) => api.get(`/copilot/sessions/${sessionId}/messages`).then(r => r.data.data),
  getSuggestions: () => api.get('/copilot/suggestions').then(r => r.data.data),
  deleteSession: (sessionId: number) => api.delete(`/copilot/sessions/${sessionId}`).then(r => r.data),
};
