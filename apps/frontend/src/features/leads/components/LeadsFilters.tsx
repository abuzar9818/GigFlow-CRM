import { LEAD_STATUS, LEAD_SOURCE, LeadStatus, LeadSource } from '@gigflow/shared';
import { Search } from 'lucide-react';

interface LeadsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: LeadStatus | '';
  onStatusChange: (value: LeadStatus | '') => void;
  source: LeadSource | '';
  onSourceChange: (value: LeadSource | '') => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export const LeadsFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sort,
  onSortChange,
}: LeadsFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search leads by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LeadStatus | '')}
          className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          {Object.values(LEAD_STATUS).map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>

        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value as LeadSource | '')}
          className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Sources</option>
          {Object.values(LEAD_SOURCE).map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
};
