import { motion } from 'framer-motion';

export const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights and performance metrics for your business.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="border border-border rounded-xl p-6 bg-card h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Conversion Rate Chart</p>
        </div>
        <div className="border border-border rounded-xl p-6 bg-card h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Revenue Growth Chart</p>
        </div>
        <div className="border border-border rounded-xl p-6 bg-card h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Lead Source Distribution</p>
        </div>
      </div>
    </motion.div>
  );
};
