import React from "react"
import { useQuery } from "@tanstack/react-query"

import { fetchSettings } from "../api/Settings"

import SettingCard from "../components/SettingCard"

export default function SettingPage() {

    /*
        To subscribe to a query in your components or custom hooks, call the useQuery hook with at least:
        - A unique key for the query
        - A function that returns a promise that:
            Resolves the data, or
            Throws an error

        The unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application.
    */

    /*
        React-Query cache mechanism => staleTime / gcTime

        staleTime: 決定資料的保鮮期多久
            That is, different components utilize the same queryKey for querying. 
            React-query would return the cached data, it would not fetch api again.

        After staleTime, react-query would not re-fetch api again. It would re-fetch api under certain trigger event.

        - referchOnMount
        - refetchOnWindownMount
        - refetchOnReconnect

        Important: 
            refetch is under background，react query will return old data from cache if data is validated，
            同時 refetch，完畢後再返回新資料，並且 re-render 這個設定可以增進使用者體驗，減少割裂感
        
        cacheTime/gcTime: 決定資料保留多久 
            when a "query become inactive", how long the data store in cache.

        For example: 
        There are three component under menu page
        1. Profile which use useUserInfo
        2. Dashboard which use useUserInfo
        3. OtherPage which not use useUserInfo

        when query option setting to gcTime = 15, staleTime = 0
        
        round 1:
          - enter dashboard page: fetch api 
          - enter OtherPage: there is not any query component monut, the number of inactive query becomes 1.
          - 當我們進入 OtherPage 15秒內切回 Dashboard 時, 雖然背景正在執行fetch api的動作, 但react-query會先從cache返回資料,
            Dashboard不會有空白的狀況發生
        
        round 2: 
          - enter dashboard page: fetch api 
          - enter OtherPage: there is not any query component monut, the number of inactive query becomes 1.
          - 等待 15 秒過後，inactive query 數量從 1 變回 0（因為該 query 也被清除了），過了 cache 保留時間，cache 已被清除.
          - 切換 Dashboard，背景正在 fetching api，但因為 cache 已被清除了，所以 fetching 時是空白的.
    
        
        The unit of staleTime/gctime in milliseconds. 

        以底下的code為例 => 

        當 component mount上去時, react-query會將fetch出來的data無限期的保留在cache資料中, 接著資料會在query變成inactive時保留1秒.
        也就是說 當component在1秒內onMount時 react-query會直接從cache內提取資料, 且不會在背景執行fetch api的動作
        而當staleTime設為0時, react-query也會直接從cache內提取資料, 但會在背景執行fetch api的動作隨後進行資料上的更新.

        而當 component內的query變為inactive時, 資料僅會保存在cache中為期1秒的時間. 1秒過後當query變回active後, react-query
        將重新fetch api一遍.

    */

    const { data: settings, isLoading: isLoadingSettings } = useQuery({
        queryFn: fetchSettings,
        queryKey: ['settings'],
        staleTime: Infinity,
        gcTime: 10000
    })

    if (isLoadingSettings){
        return (
            <div>
                <h1>Loading..</h1>
            </div>
        )
    }

    return (
        <div>
            {settings && Object.entries(settings).map(([key, value]) => (
                <SettingCard key={key} topic={key} settings={value}/>
            ))}
        </div>
    )
}