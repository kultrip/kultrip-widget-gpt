import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWidget from "./pages/ChatWidget";
import "./index.css";

const queryClient = new QueryClient();

interface WidgetAppProps {
  userId?: string;
}

const WidgetApp = ({ userId }: WidgetAppProps) => {
  console.log('🎨 WidgetApp: Rendering with userId:', userId);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div style={{ width: '100%', height: '100%', background: 'red', minHeight: '600px' }}>
          <ChatWidget userId={userId} />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Widget initialization function
const initKultripWidget = (containerId: string, options: any = {}) => {
  console.log('🚀 Kultrip Widget: Initializing...', { containerId, options });
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Kultrip Widget: Container with id "${containerId}" not found`);
    return;
  }
  
  console.log('✅ Kultrip Widget: Container found', container);

  // Apply default styles to container
  if (!container.style.width) container.style.width = '100%';
  if (!container.style.height) container.style.height = '600px';
  if (!container.style.position) container.style.position = 'relative';
  
  console.log('📐 Kultrip Widget: Applied styles', container.style.cssText);

  try {
    const root = createRoot(container);
    console.log('🎯 Kultrip Widget: Created React root');
    
    root.render(<WidgetApp userId={options.userId} />);
    console.log('✨ Kultrip Widget: Rendered WidgetApp component');
    
    return {
      destroy: () => {
        console.log('🗑️ Kultrip Widget: Destroying...');
        root.unmount();
      }
    };
  } catch (error) {
    console.error('❌ Kultrip Widget: Error during initialization:', error);
    return null;
  }
};

// Expose widget to global scope immediately
if (typeof window !== 'undefined') {
  (window as any).KultripWidget = {
    init: initKultripWidget
  };
}

// Export for UMD build
export const init = initKultripWidget;
export default { init: initKultripWidget };