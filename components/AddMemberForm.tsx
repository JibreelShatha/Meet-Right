import React, { useState, useEffect, useRef, useMemo } from 'react';

interface AddMemberFormProps {
  onAddMember: (name: string, timezone: string) => void;
}

// Static list of IANA timezones for broad compatibility.
const timezones = [
  'UTC', 'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'America/Anchorage',
  'America/Argentina/Buenos_Aires', 'America/Bogota', 'America/Caracas',
  'America/Chicago', 'America/Denver', 'America/Godthab', 'America/Guatemala',
  'America/Halifax', 'America/Los_Angeles', 'America/Mexico_City',
  'America/New_York', 'America/Phoenix', 'America/Regina', 'America/Santiago',
  'America/Sao_Paulo', 'America/St_Johns', 'Asia/Baghdad', 'Asia/Bangkok',
  'Asia/Beirut', 'Asia/Dhaka', 'Asia/Dubai', 'Asia/Hong_Kong', 'Asia/Jakarta',
  'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Kolkata',
  'Asia/Magadan', 'Asia/Muscat', 'Asia/Riyadh', 'Asia/Seoul', 'Asia/Shanghai',
  'Asia/Singapore', 'Asia/Tehran', 'Asia/Tokyo', 'Asia/Yakutsk', 'Atlantic/Azores',
  'Atlantic/Cape_Verde', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Darwin',
  'Australia/Hobart', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney',
  'Etc/GMT', 'Etc/GMT+1', 'Etc/GMT+10', 'Etc/GMT+11', 'Etc/GMT+12', 'Etc/GMT+2', 'Etc/GMT+3',
  'Etc/GMT+4', 'Etc/GMT+5', 'Etc/GMT+6', 'Etc/GMT+7', 'Etc/GMT-1', 'Etc/GMT-10', 'Etc/GMT-11',
  'Etc/GMT-12', 'Etc/GMT-13', 'Etc/GMT-14', 'Etc/GMT-2', 'Etc/GMT-3', 'Etc/GMT-4', 'Etc/GMT-5',
  'Etc/GMT-6', 'Etc/GMT-7', 'Etc/GMT-8', 'Etc/GMT-9', 'Europe/Amsterdam', 'Europe/Athens',
  'Europe/Belgrade', 'Europe/Berlin', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Copenhagen',
  'Europe/Dublin', 'Europe/Helsinki', 'Europe/Istanbul', 'Europe/Kiev', 'Europe/Lisbon',
  'Europe/London', 'Europe/Madrid', 'Europe/Minsk', 'Europe/Moscow', 'Europe/Oslo',
  'Europe/Paris', 'Europe/Prague', 'Europe/Rome', 'Europe/Stockholm', 'Europe/Vienna',
  'Europe/Warsaw', 'Europe/Zurich', 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Guam',
  'Pacific/Honolulu', 'Pacific/Pago_Pago'
];

const gmtRegex = /^(?:GMT)?([+-])(\d{1,2})$/i;

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ onAddMember }) => {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredTimezones = useMemo(() => {
    if (!query) return [];

    const lowerCaseQuery = query.toLowerCase().replace(/_/g, ' ');

    // Check for GMT format
    const gmtMatch = query.match(gmtRegex);
    if (gmtMatch) {
      const sign = gmtMatch[1];
      const offset = parseInt(gmtMatch[2], 10);
      if (offset >= 0 && offset <= 12) {
        // Etc/GMT uses inverse sign, e.g., user input GMT+5 is Etc/GMT-5
        const etcSign = sign === '+' ? '-' : '+';
        return [`Etc/GMT${etcSign}${offset}`];
      }
    }

    return timezones.filter(tz =>
      tz.toLowerCase().replace(/_/g, ' ').includes(lowerCaseQuery)
    ).slice(0, 10);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleSelectTimezone = (timezone: string) => {
    setQuery(timezone);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % filteredTimezones.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredTimezones.length) % filteredTimezones.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredTimezones[highlightedIndex]) {
        handleSelectTimezone(filteredTimezones[highlightedIndex]);
      } else if (filteredTimezones.length === 1) { // Auto-select if there's only one match (e.g., from GMT input)
        handleSelectTimezone(filteredTimezones[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidTimezone = timezones.includes(query) || /^Etc\/GMT[+-]\d{1,2}$/.test(query);

    if (name && query && isValidTimezone) {
      onAddMember(name, query);
      setName('');
      setQuery('');
    } else {
        alert("Please select a valid timezone from the list.");
    }
  };

  return (
    <div className="mb-12 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team Member's Name"
          required
          className="w-full sm:w-1/3 px-4 py-2 bg-slate-700/50 rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-shadow"
        />
        <div className="relative w-full sm:w-1/2" ref={wrapperRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setHighlightedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search timezone (e.g. 'London' or 'GMT-5')"
            required
            autoComplete="off"
            className="w-full px-4 py-2 bg-slate-700/50 rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-shadow"
          />
          {isOpen && filteredTimezones.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredTimezones.map((tz, index) => (
                <li
                  key={tz}
                  onClick={() => handleSelectTimezone(tz)}
                  onMouseOver={() => setHighlightedIndex(index)}
                  className={`px-4 py-2 cursor-pointer hover:bg-sky-600 ${
                    index === highlightedIndex ? 'bg-sky-600' : ''
                  }`}
                >
                  {tz.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold transition-colors">
          Add Member
        </button>
      </form>
    </div>
  );
};
