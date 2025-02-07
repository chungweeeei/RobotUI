import { createContext, useContext, useEffect, useState } from "react";

/* React Query handle:
 * Request Call
 * Dependent Queries
 * Paginated Queries
 * Polling
 * Prefetching
 * Mutations
 * Data Selector
 * Auto Refetching
 * Window Focus Refetching
 * Infinite Scrolling
 * Cache Management
 * Cache Invalidation
 * Offline Support
 * Scroll Recovery
 */

const WhyUseReactQuery = () => {
 // * #1 Starting point of data fetching
 //#region
 // const [data, setData] = useState();
 // useEffect(() => {
 //  fetchUser().then((data) => {
 //   console.log("User data fetched", data);
 //   setData(data);
 //  });
 // }, []);
 //#endregion

 // * #2 Handle loading and error state -> more state
 //#region
 // const [data, setData] = useState();
 // const [isLoading, setIsLoading] = useState(false);
 // const [error, setError] = useState(null);
 // useEffect(() => {
 //  setIsLoading(true);
 //  setError(null);

 //  fetchUser()
 //   .then((data) => {
 //    console.log("User data fetched", data);
 //    setData(data);
 //   })
 //   .catch((e) => {
 //    setError(e);
 //   })
 //   .finally(() => {
 //    setIsLoading(false);
 //   });
 // }, []);
 //#endregion

 // * #3 Fix the bug of race condition
 // hint: Since the fetch call is asynchronous, the time it takes to resolve is uncertain.
 //#region
 // const [data, setData] = useState();
 // const [isLoading, setIsLoading] = useState(false);
 // const [error, setError] = useState(null);
 // useEffect(() => {
 //  let ignore = false;
 //  setIsLoading(true);
 //  setError(null);

 //  fetchUser()
 //   .then((data) => {
 //    if (ignore) {
 //     console.log("User data fetched", data);
 //     setData(data);
 //    }
 //   })
 //   .catch((e) => {
 //    if (ignore) {
 //     setError(e);
 //    }
 //   })
 //   .finally(() => {
 //    if (ignore) {
 //     setIsLoading(false);
 //    }
 //   });

 //  return () => {
 //   ignore = true;
 //  };
 // }, []);
 //#endregion

 // * #4 Custom Hook
 //#region
 // const {
 //  data: users,
 //  isLoading,
 //  error,
 // } = useQuery("https://jsonplaceholder.typicode.com/users");
 // console.log(users, isLoading, error);
 //#endregion

 // * #5 Handle data duplication(every components will have its own instance of the state) -> leading inconsistency(one is success while one is error)
 // * use drilling props or context

 // * #6 How about cache invalidation...

 // * #7 How to optimize the context to prevent unnecessary re-render

 // * FINAL: Use React Query for data fetching and caching
 return <></>;
};
export default WhyUseReactQuery;

function delay(ms: number) {
 return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUser() {
 const response = await fetch("https://jsonplaceholder.typicode.com/users");
 const data = await response.json();
 await delay(1000);
 return data;
}

function useQuery(url: string) {
 const [data, setData] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<unknown>(null);

 useEffect(() => {
  let ignore = false;

  const handleFetch = async () => {
   setData(null);
   setIsLoading(true);
   setError(null);

   try {
    const res = await fetch(url);

    if (ignore) {
     return;
    }

    if (res.ok === false) {
     throw new Error("A network error occurred.");
    }

    const json = await res.json();

    setData(json);
    setIsLoading(false);
   } catch (e) {
    setError(e);
    setIsLoading(false);
   }
  };

  handleFetch();

  return () => {
   ignore = true;
  };
 }, [url]);

 return { data, isLoading, error };
}

// * #5 wrap app with provider and get query from it, first time is fetching result, second time is cache
const queryContext = createContext([{}, () => {}]);

function QueryProvider({ children }: { children: React.ReactNode }) {
 const tuple = useState({});

 return (
  <queryContext.Provider value={tuple}>{children}</queryContext.Provider>
 );
}

function useQueryWithContext(url) {
 const [state, setState] = useContext(queryContext);

 useEffect(() => {
  const update = (newState) =>
   setState((prevState) => ({
    ...prevState,
    [url]: { ...prevState[url], ...newState },
   }));

  let ignore = false;

  const handleFetch = async () => {
   update({ data: null, isLoading: true, error: null });

   try {
    const res = await fetch(url);

    if (ignore) {
     return;
    }

    if (res.ok === false) {
     throw new Error("A network error occurred.");
    }

    const data = await res.json();

    update({ data, isLoading: false, error: null });
   } catch (e) {
    update({ error: e.message, isLoading: false, data: null });
   }
  };

  handleFetch();

  return () => {
   ignore = true;
  };
 }, [url, setState]);

 return state[url] || { data: null, isLoading: true, error: null };
}
 