import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { LeadsTable } from './components/LeadsTable';
import { LeadsFilters } from './components/LeadsFilters';
import { CreateLeadModal, EditLeadModal, DeleteLeadModal } from './components/LeadModals';
import { LeadKanbanBoard } from './components/LeadKanbanBoard';
import { useLeads } from './hooks/useLeads';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { CreateLeadInput, UpdateLeadInput, ILead, LeadStatus, LeadSource } from '@gigflow/shared';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const LeadsPage = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  
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

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('');
    setSource('');
    setSort('latest');
    setPage(1);
  };

  const pipelineQuery = useLeads({
    page: 1,
    limit: 200,
    status,
    source,
    search: debouncedSearch,
    sort: 'latest',
  });

  const tableQuery = useLeads({
    page,
    limit,
    status,
    source,
    search: debouncedSearch,
    sort,
  });

  const activeQuery = viewMode === 'pipeline' ? pipelineQuery : tableQuery;
  const leads = activeQuery.data?.data?.leads || [];
  const pagination = tableQuery.data?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const hasFilters = Boolean(search || status || source || sort !== 'latest');

  const updateCachedLeads = (updater: (lead: ILead) => ILead) => {
    queryClient.setQueriesData({ queryKey: ['leads'] }, (oldData: any) => {
      if (!oldData?.data?.leads) return oldData;

      return {
        ...oldData,
        data: {
          ...oldData.data,
          leads: oldData.data.leads.map((lead: ILead) => updater(lead)),
        },
      };
    });
  };

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

  const moveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) => api.patch(`/leads/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ['leads'] });

      updateCachedLeads((lead) => (lead.id === id ? { ...lead, status } : lead));

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error('Failed to move lead. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead status updated');
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

  const handleMoveLead = async (lead: ILead, nextStatus: LeadStatus) => {
    await moveMutation.mutateAsync({ id: lead.id, status: nextStatus });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-muted-foreground">
            Manage, score, and move your pipeline with a modern Kanban flow.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-2xl border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                viewMode === 'pipeline' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Pipeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                viewMode === 'table' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Table
            </button>
          </div>

          <Button onClick={() => setIsCreateOpen(true)}>Add Lead</Button>
        </div>
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
        onClearFilters={clearFilters}
        hasActiveFilters={hasFilters}
      />

      {activeQuery.isError ? (
        <div className="border border-border rounded-xl bg-card p-6 text-center text-red-500">
          Failed to load leads. Please try again.
        </div>
      ) : (
        <>
          {viewMode === 'pipeline' ? (
            <LeadKanbanBoard
              leads={leads}
              onEdit={(lead) => { setSelectedLead(lead); setIsEditOpen(true); }}
              onMoveLead={handleMoveLead}
              isUpdating={moveMutation.isPending}
              isLoading={activeQuery.isLoading}
            />
          ) : (
            <>
              <LeadsTable
                leads={leads}
                isLoading={activeQuery.isLoading}
                onEdit={(lead) => { setSelectedLead(lead); setIsEditOpen(true); }}
                onDelete={(lead) => { setSelectedLead(lead); setIsDeleteOpen(true); }}
              />

              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
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
