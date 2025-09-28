
import React, { useState, useEffect } from 'react';
import { AddMemberForm } from './components/AddMemberForm';
import { TeamMemberCard } from './components/TeamMemberCard';
import { TeamMember } from './types';

const App: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    try {
      const savedMembers = localStorage.getItem('teamMembers');
      return savedMembers ? JSON.parse(savedMembers) : [
        { id: '1', name: 'You', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { id: '2', name: 'Alice', timezone: 'Europe/London' },
        { id: '3', name: 'Bob', timezone: 'America/New_York' },
      ];
    } catch (error) {
      console.error("Failed to parse team members from localStorage", error);
      return [];
    }
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(members));
  }, [members]);

  const addTeamMember = (name: string, timezone: string) => {
    const newMember: TeamMember = {
      id: new Date().toISOString(),
      name,
      timezone,
    };
    setMembers(prevMembers => [...prevMembers, newMember]);
  };
  
  const deleteTeamMember = (id: string) => {
    setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
           <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 pb-2">
            Meet Right
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Your Team's Timezones, Synchronized.</p>
        </header>

        <main>
          <AddMemberForm onAddMember={addTeamMember} />

          {members.length > 0 ? (
            <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory">
              {members.map(member => (
                 <div key={member.id} className="snap-center">
                    <TeamMemberCard member={member} currentTime={currentTime} onDelete={deleteTeamMember} />
                 </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 px-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-lg">
                <h3 className="text-2xl font-semibold text-slate-300">No Team Members Yet</h3>
                <p className="text-slate-400 mt-2">Use the form above to add your first team member.</p>
             </div>
          )}
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Built for modern remote teams.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
