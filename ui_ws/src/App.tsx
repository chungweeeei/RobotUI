import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import VersionPage from './Version/VersionPage';
// import SettingPage from './Setting/Setting';

// create queryClient instance
const queryClient = new QueryClient();


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <VersionPage /> 
    </QueryClientProvider>
  )
}

export default App;
