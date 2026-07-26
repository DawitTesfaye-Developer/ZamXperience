// src/hooks/useMissions.ts
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../services/api';

// Types
export interface Choice {
  text: string;
  nextId: string | null;
  impact: {
    mood: number;    // Positive or negative delta
    time: number;    // Minutes saved or lost
  };
}

export interface Scenario {
  id: string;
  prompt: string;
  order: number;
  choices: Choice[];
  isEnding: boolean;
  endingMessage?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  estimatedMinutes: number;
  academyCategory: string;
  scenarios: Scenario[];
}

// Fetch today's mission
export const useTodaysMission = () => {
  return useQuery<Mission>({
    queryKey: ['missions', 'today'],
    queryFn: async () => {
      const response = await api.get('/missions/today');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Process a decision (post choice)
export const useProcessDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scenarioId,
      choiceIndex,
    }: {
      scenarioId: string;
      choiceIndex: number;
    }) => {
      const response = await api.post(`/scenarios/${scenarioId}/decide`, {
        choiceIndex,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user XP after a decision
      queryClient.invalidateQueries({queryKey: ['user']});
    },
  });
};