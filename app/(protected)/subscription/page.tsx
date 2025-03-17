import { Metadata } from 'next';
import SubscriptionPage from '@/app/components/subscription/SubscriptionPage';
import PromotionBanner from '@/app/components/subscription/PromotionBanner';
//import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Suscripción | SysDiagramAI',
  description: 'Gestiona tu suscripción a SysDiagramAI',
};

export default function Page() {
  return (
    <div className='bg-base-100'>
      <PromotionBanner />
      
      <SubscriptionPage />
    </div>
  );
} 