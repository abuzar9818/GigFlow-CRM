import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeadSchema, CreateLeadInput, UpdateLeadSchema, UpdateLeadInput, LEAD_STATUS, LEAD_SOURCE, ILead } from '@gigflow/shared';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { LeadActivityTimeline } from './LeadActivityTimeline';
import { LeadScoreBadge } from './LeadScoreBadge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateModalProps extends ModalProps {
  onSubmit: (data: CreateLeadInput) => Promise<void>;
  isLoading: boolean;
}

export const CreateLeadModal = ({ isOpen, onClose, onSubmit, isLoading }: CreateModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateLeadInput>({
    resolver: zodResolver(CreateLeadSchema),
  });

  const handleFormSubmit = async (data: CreateLeadInput) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 lg:px-6">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Create New Lead</h3>
                <p className="mt-1 text-sm text-muted-foreground">Capture the lead with the right source and status from the start.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="-mr-2 -mt-1 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 px-5 py-5 lg:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    {...register('name')}
                    className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Status</label>
                  <select
                    {...register('status')}
                    className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  >
                    {Object.values(LEAD_STATUS).map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                  {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Source</label>
                  <select
                    {...register('source')}
                    className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">Select Source</option>
                    {Object.values(LEAD_SOURCE).map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                  {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <textarea
                  {...register('notes')}
                  className="min-h-28 w-full rounded-2xl border border-border bg-background/80 px-3 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  rows={4}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Create Lead</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface EditModalProps extends ModalProps {
  lead: ILead | null;
  onSubmit: (id: string, data: UpdateLeadInput) => Promise<void>;
  isLoading: boolean;
}

export const EditLeadModal = ({ isOpen, onClose, lead, onSubmit, isLoading }: EditModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateLeadInput>({
    resolver: zodResolver(UpdateLeadSchema),
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes,
      });
    }
  }, [lead, reset]);

  const handleFormSubmit = async (data: UpdateLeadInput) => {
    if (lead) {
      await onSubmit(lead.id, data);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && lead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 lg:px-6">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Edit Lead</h3>
                <p className="mt-1 text-sm text-muted-foreground">Update details, move the lead, and review its activity trail.</p>
              </div>
              <div className="flex items-center gap-3">
                <LeadScoreBadge lead={lead} compact />
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-5 lg:p-6">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    {...register('name')}
                    className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Status</label>
                    <select
                      {...register('status')}
                      className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      {Object.values(LEAD_STATUS).map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                    {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Source</label>
                    <select
                      {...register('source')}
                      className="h-11 w-full rounded-2xl border border-border bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      {Object.values(LEAD_SOURCE).map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                    {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Notes</label>
                  <textarea
                    {...register('notes')}
                    className="min-h-32 w-full rounded-2xl border border-border bg-background/80 px-3 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    rows={4}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                  <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                  <Button type="submit" isLoading={isLoading}>Save Changes</Button>
                </div>
              </form>

              <div className="border-t border-border bg-muted/20 p-5 lg:border-l lg:border-t-0 lg:p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Activity timeline</h4>
                  <p className="mt-1 text-sm text-muted-foreground">Created, updated, and status changes are tracked here.</p>
                </div>
                <LeadActivityTimeline activities={lead.activityTimeline} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface DeleteModalProps extends ModalProps {
  lead: ILead | null;
  onConfirm: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const DeleteLeadModal = ({ isOpen, onClose, lead, onConfirm, isLoading }: DeleteModalProps) => {
  const handleDelete = async () => {
    if (lead) {
      await onConfirm(lead.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && lead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto mt-20 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Delete Lead</h3>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-2 border-t border-border bg-muted/50 p-4">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="ghost" onClick={handleDelete} isLoading={isLoading} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
