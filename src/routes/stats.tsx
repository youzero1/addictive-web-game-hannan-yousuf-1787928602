import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import StatsPanel from '@/components/StatsPanel';
import AchievementGrid from '@/components/AchievementGrid';
import Leaderboard from '@/components/Leaderboard';
import { loadBest, loadLeaderboard, loadProfile, resetAllData, emptyProfile } from '@/lib/storage';

export const Route = createFileRoute('/stats')({
  component: StatsPage,
});

function StatsPage() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [best, setBest] = useState(() => loadBest());
  const [entries, setEntries] = useState(() => loadLeaderboard());

  const reset = () => {
    resetAllData();
    setProfile(emptyProfile);
    setBest(0);
    setEntries([]);
  };

  return (
    <div className="space-y-4 py-2">
      <h1 className="text-xl font-black uppercase tracking-[0.2em]">Your progress</h1>
      <StatsPanel profile={profile} best={best} onReset={reset} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <AchievementGrid unlocked={profile.unlocked} />
        <Leaderboard entries={entries} currentScore={-1} newBest={false} />
      </div>
    </div>
  );
}
