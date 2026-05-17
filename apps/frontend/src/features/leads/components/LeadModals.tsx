import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeadSchema, CreateLeadInput, UpdateLeadSchema, UpdateLeadInput, LEAD_STATUS, LEAD_SOURCE, ILead } from '@gigflow/shared';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Create New Lead</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <select
                  {...register('source')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                  <option value="">Select Source</option>
                  {Object.values(LEAD_SOURCE).map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                {errors.source && <p className="text-xs text-red-500 mt-1">{errors.source.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  {...register('notes')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Create</Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Edit Lead</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                  {Object.values(LEAD_STATUS).map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <select
                  {...register('source')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                  {Object.values(LEAD_SOURCE).map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                {errors.source && <p className="text-xs text-red-500 mt-1">{errors.source.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  {...register('notes')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Save Changes</Button>
              </div>
            </form>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Delete Lead</h3>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-2 p-4 border-t border-border bg-muted/50">
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
