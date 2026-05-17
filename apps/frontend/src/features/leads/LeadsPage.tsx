import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

export const LeadsPage = () => {
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
        <Button>Add Lead</Button>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">All Leads</h3>
        </div>
        <div className="p-6 flex items-center justify-center h-64">
          <p className="text-muted-foreground">Leads table will appear here.</p>
        </div>
      </div>
    </motion.div>
  );
};
