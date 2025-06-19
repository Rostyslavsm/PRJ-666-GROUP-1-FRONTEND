// src/pages/goals.js
import dynamic from 'next/dynamic';
import Layout from '@/componentShared/Layout';
import ProtectedRoute from '@/componentShared/ProtectedRoute';
import LoadingState from '@/features/goals/components/LoadingState';

// Dynamically import the Goals component with no SSR
const Goals = dynamic(() => import('@/features/goals/components/Goals'), {
  ssr: false,
  loading: () => <LoadingState />,
});

export default function GoalsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="">
          <Goals />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
