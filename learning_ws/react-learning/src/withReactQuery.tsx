import React, { useState } from "react";

// using react-query => import QueryClient
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'

// customize demo component
import Demo from "../components/Demo.tsx"


// create queryClient instance
const queryClient = new QueryClient();


function WithReactQuery() {
    
    // QueryClientProvideer allow us to use the client antwhere in the application througt the context. 
    // {TODO} need to learning the context provider.

    const [showDemo, setShowDemo] = useState(true);

    // add Toggle button to let component mount/unmount.

    return (
        <QueryClientProvider client={queryClient}>
            <button onClick={() => setShowDemo(!showDemo)}>Toggle Demo</button>
            {showDemo && <Demo />}
        </QueryClientProvider>
    );
}

export default WithReactQuery;