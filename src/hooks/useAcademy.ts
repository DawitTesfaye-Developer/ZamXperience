import {useQuery} from '@tanstack/react-query';

export interface AcademyCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessonCount: number;
  completedCount: number;
  color: string;
}

export const useAcademies = () => {
  return useQuery<AcademyCategory[]>({
    queryKey: ['academies'],
    queryFn: async () => {
      // Mock data for now until backend is ready
      // Replace with: const res = await api.get('/academies'); return res.data;
      return [
        {id: '1', name: 'Customer Care', icon: '💬', description: 'Master empathy and conflict resolution', lessonCount: 12, completedCount: 8, color: '#4caf50'},
        {id: '2', name: 'Leadership', icon: '👔', description: 'Become a branch leader', lessonCount: 10, completedCount: 3, color: '#2196f3'},
        {id: '3', name: 'Communication', icon: '🗣️', description: 'Clear and effective communication', lessonCount: 8, completedCount: 5, color: '#9c27b0'},
        {id: '4', name: 'Digital Banking', icon: '📱', description: 'Master digital products', lessonCount: 15, completedCount: 2, color: '#ff9800'},
        {id: '5', name: 'Cybersecurity', icon: '🔒', description: 'Protect customer data', lessonCount: 9, completedCount: 9, color: '#f44336'},
        {id: '6', name: 'Compliance', icon: '📋', description: 'Stay compliant and audit-ready', lessonCount: 7, completedCount: 1, color: '#607d8b'},
        {id: '7', name: 'Sales', icon: '📈', description: 'Boost cross-selling skills', lessonCount: 11, completedCount: 0, color: '#e91e63'},
        {id: '8', name: 'Financial Literacy', icon: '💰', description: 'Deepen financial knowledge', lessonCount: 6, completedCount: 6, color: '#009688'},
      ];
    },
    staleTime: 10 * 60 * 1000,
  });
};