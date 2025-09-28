
import React from 'react';
import { TeamMember, WorkingHoursStatus } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
  currentTime: Date;
  onDelete: (id: string) => void;
}

const getWorkingHoursStatus = (date: Date, timezone: string): WorkingHoursStatus => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const hour = parseInt(formatter.format(date), 10);

  if (hour >= 9 && hour < 17) {
    return WorkingHoursStatus.WORKING;
  }
  if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19)) {
    return WorkingHoursStatus.BORDERLINE;
  }
  return WorkingHoursStatus.OFF;
};

const StatusIndicator: React.FC<{ status: WorkingHoursStatus }> = ({ status }) => {
  const statusConfig = {
    [WorkingHoursStatus.WORKING]: {
      color: 'bg-green-500',
      shadow: 'shadow-[0_0_8px_rgba(34,197,94,0.7)]',
      label: 'Working Hours',
    },
    [WorkingHoursStatus.BORDERLINE]: {
      color: 'bg-yellow-400',
      shadow: 'shadow-[0_0_8px_rgba(250,204,21,0.7)]',
      label: 'Borderline Hours',
    },
    [WorkingHoursStatus.OFF]: {
      color: 'bg-red-500',
      shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.7)]',
      label: 'Off Hours',
    },
  };

  const { color, shadow, label } = statusConfig[status];

  return (
    <div className="flex items-center gap-2" title={label}>
      <div className={`w-3 h-3 rounded-full ${color} ${shadow}`}></div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, currentTime, onDelete }) => {
  const localTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: member.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const localDateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: member.timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const status = getWorkingHoursStatus(currentTime, member.timezone);
  
  return (
    <div className="relative flex-shrink-0 w-64 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 flex flex-col gap-4 transform hover:scale-105 transition-transform duration-300">
       <button 
         onClick={() => onDelete(member.id)}
         className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors"
         title="Remove member"
       >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
       </button>
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-100">{member.name}</h2>
        <p className="text-sm text-slate-400">{member.timezone.replace(/_/g, ' ')}</p>
      </div>
      <div className="text-center my-2">
        <p className="text-5xl font-mono font-bold text-sky-400">{localTimeFormatter.format(currentTime)}</p>
        <p className="text-md text-slate-300">{localDateFormatter.format(currentTime)}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-700">
        <StatusIndicator status={status} />
      </div>
    </div>
  );
};
