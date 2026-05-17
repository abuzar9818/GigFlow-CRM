import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { LeadsTable } from './components/LeadsTable';
import { LeadsFilters } from './components/LeadsFilters';
import { CreateLeadModal, EditLeadModal, DeleteLeadModal } from './components/LeadModals';
import { useLeads } from './hooks/useLeads';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { CreateLeadInput, UpdateLeadInput, ILead, LeadStatus, LeadSource } from '@gigflow/shared';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const LeadsPage = () => {
  const queryClient = useQueryClient();
  
  // Filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useLeads({
    page,
    limit,
    status,
    source,
    search: debouncedSearch,
    sort,
  });

  const leads = data?.data?.leads || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newLead: CreateLeadInput) => api.post('/leads', newLead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) => api.patch(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully');
    },
  });

  const handleCreateSubmit = async (data: CreateLeadInput) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditSubmit = async (id: string, data: UpdateLeadInput) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your potential clients.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Add Lead</Button>
      </div>

      <LeadsFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        source={source}
        onSourceChange={setSource}
        sort={sort}
        onSortChange={setSort}
      />

      {isError ? (
        <div className="border border-border rounded-xl bg-card p-6 text-center text-red-500">
          Failed to load leads. Please try again.
        </div>
      ) : (
        <>
          <LeadsTable
            leads={leads}
            isLoading={isLoading}
            onEdit={(lead) => { setSelectedLead(lead); setIsEditOpen(true); }}
            onDelete={(lead) => { setSelectedLead(lead); setIsDeleteOpen(true); }}
          />

          {/* Pagination UI */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateLeadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />

      <EditLeadModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedLead(null); }}
        lead={selectedLead}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />

      <DeleteLeadModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedLead(null); }}
        lead={selectedLead}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
};
