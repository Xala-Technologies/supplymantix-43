
import React from 'react';
import { useTeams } from '@/hooks/useTeams';
import { MultiSelectDropdown } from './MultiSelectDropdown';

interface TeamsSectionProps {
  selectedTeamIds: string[];
  onTeamToggle: (teamId: string) => void;
}

export const TeamsSection: React.FC<TeamsSectionProps> = ({
  selectedTeamIds,
  onTeamToggle
}) => {
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();

  const getSelectedTeamNames = () => {
    if (!teams || !selectedTeamIds) return [];
    return teams
      .filter(team => selectedTeamIds.includes(team.id))
      .map(team => team.name);
  };

  return (
    <MultiSelectDropdown
      label="Teams"
      placeholder="Search and select teams..."
      items={teams || []}
      selectedIds={selectedTeamIds || []}
      isLoading={teamsLoading}
      error={teamsError}
      onToggle={onTeamToggle}
      onRemove={onTeamToggle}
      getSelectedNames={getSelectedTeamNames}
    />
  );
};
