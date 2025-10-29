import {
  TeamCards,
  AddTeamDialog,
  Navbar,
  TeamsPageSkeleton,
} from "@/components/index";
import { useState } from "react";
import { type Team } from "@/types";
import { useTeams } from "@/hooks";

export function TeamsPage() {
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { data: teams, isLoading } = useTeams();

  if (isLoading) return <TeamsPageSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onClick={() => {
          setSelectedTeam(null);
          setIsAddTeamDialogOpen(true);
        }}
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <TeamCards
          teams={teams || []}
          onCardClick={(id) => {
            const team = teams?.find((t) => t._id === id);
            setSelectedTeam(team || null);
            setIsAddTeamDialogOpen(true);
          }}
        />
        <AddTeamDialog
          isOpen={isAddTeamDialogOpen}
          onClose={() => {
            setIsAddTeamDialogOpen(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam || undefined}
        />
      </main>
    </div>
  );
}
