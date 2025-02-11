import React, { useEffect, useState, version } from 'react'

type VersionInfo = {
  version: string;
  upgrade_from: string;
  state: string;
  started_at: string;
  finished_at: string;
  builded_at: string
}

type Versions = {
  total: number;
  page: number;
  size: number;
  items: Array<VersionInfo>;
};

function WithoutReactQuery() {

  /*
    It is less convenient for data fetching on react if we do not rely on other third-party library.

    React is able to achieve below function like, global state, success or error status, cache, background updating...,
    however, it need go through more complicated process.

    Hook: useState, useEffect

    However, when using useEffect(Hook) might face below problem:

    1. Multiple API Calls Due to Re-Rendering
      Problem: 
        - If useEffect depends on a state or prop that changes frequently, it may trigger multiple API calls.
        - If useEffect is missing a dependency array, it will run on every render.
      Solution:
        useEffect(() => {fetchData()}, []);
        useEffect(() => {fetchData()}, [userId]); // API will only be called when userId changes
    
    2. Race Condition (Outdated Responses Overwriting Newer Ones)
      // 當useEffect內部的fetch請求還未完成, 
      // React re-render導致useEffect重新執行,
      // 可能會產生race condition,
      // 使得最新的request結果被舊的請求結果覆蓋.
      Problem:
        - If multiple API calls are triggered asynchronously, 
          an earlier response might return after a later one, 
          overwriting newer data.
      Solution:
        - Use AbortController to cancel previous requests:
    
    3. Infinite Re-Renders (State Change Inside useEffect)
      Problem:
        - If you update state inside useEffect, 
          and the state is in the dependency array, 
          it causes an infinite loop because each state change triggers a re-render.
      Solution:
        - Avoid updating state that's in the dependency array.
      
    4. Memory Leaks (Updating State on Unmounted Component)
      // 若component unmount時, fetch仍在進行, 而state仍視圖更新,
      // React會發出 'Can't perform a React state update on an unmounted component'警告.
      Problem:
        - Use a cleanup function in useEffect
    
    5. Error Handling Issues
      Problem:
        - API calls might failed due to network errors, server downtime, or incorrect responses.
        - If errors are not handled properly, they can crash the application
      Solution:
        - Use try-catch for error handling
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("https://api.example.com/data");
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            setData(data);
          } catch (error) {
            setError(error.message); // Store error for UI display
          }
        };
        fetchData();
      }, []);

      return error ? <p>Error: {error}</p> : <p>Data: {data}</p>;

    6. Slow Performance Due to Heavy API Calls
      
      Problem:
        - If the API is slow or the data is large, it can impact performance and UI responsiveness
      Solution:
        - Debounce the API call
        - Cache API responses
  */

  const [versions, setVersions] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch("http://172.27.0.4:3000/v1/versions");
        console.log(response);
        
        if(response.status !== 200 && !response.ok)
          throw new Error("Fetch data fail");

        const versions: Versions = await response.json();

        setVersions(versions);
        console.log(versions);
        setSuccess(true);

      } catch(error){
        setErrorMessage(error.message);
      }
    };
    fetchVersions();
  }, [])


  return (
    <>
      <h1>Test</h1>
    </>
  )
}


export default WithoutReactQuery;
