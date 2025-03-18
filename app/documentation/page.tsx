'use client';

import { useState } from 'react';
import DocumentationLayout from '../components/documentation/DocumentationLayout';
import IntroductionSection from '../components/documentation/sections/IntroductionSection';
import GettingStartedSection from '../components/documentation/sections/GettingStartedSection';
import RequirementsFormSection from '../components/documentation/sections/RequirementsFormSection';
import ResultsInterpretationSection from '../components/documentation/sections/ResultsInterpretationSection';
import DesignFrameworkSection from '../components/documentation/sections/DesignFrameworkSection';
import TechArchitectureSection from '../components/documentation/sections/TechArchitectureSection';
import SubscriptionSection from '../components/documentation/sections/SubscriptionSection';
import AdvancedResourcesSection from '../components/documentation/sections/AdvancedResourcesSection';
import SupportCommunitySection from '../components/documentation/sections/SupportCommunitySection';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  
  // Manejador para cambiar la sección activa
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };
  
  return (
    <DocumentationLayout 
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      <h1>Documentación de SysDiagramAI</h1>
      
      <IntroductionSection />
      <GettingStartedSection />
      <RequirementsFormSection />
      <ResultsInterpretationSection />
      <DesignFrameworkSection />
      <TechArchitectureSection />
      <SubscriptionSection />
      <AdvancedResourcesSection />
      <SupportCommunitySection />
    </DocumentationLayout>
  );
}
