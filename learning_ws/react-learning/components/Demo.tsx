import React, { useState } from "react";

// import useQuery Hook in order to using react-quert
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// api function 
import { fetchTodos, addTodo } from "../api";

//
import TodoCard from "./TodoCard";

export default function Demo(){

    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");

    // react-query will use this queryKey as a formal identification for the query todo everything in react-query
    // in react-query, the default will cache the data, and show the data.
    // However, react-query will make a request even though they showing the cache data.
    const { data: todos, isLoading } = useQuery({
        queryFn: () => fetchTodos(),
        queryKey: ["todos", { search }],
        staleTime: Infinity,
    });


    const { mutateAsync: addTodoMutation } = useMutation({
        mutationFn: addTodo,
        // the case => after mutation success need to tell react-query to fetch api
        // then this need to add onSuccess property in the useMutation hook'
        // invalidateQueries will force react-query re-fetch the todos
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        }
    })

    if (isLoading) {
        return (
            <div>Loading</div>
        );
    }

    // Here the reason why we have question mark, is because, initially before queryFn execute,
    // the data parameter is going to be undefined.

    return (
        <div>
            <div>
                <input type="text"
                       onChange={(e) => setTitle(e.target.value)} 
                       value={title}
                />
                <button onClick={async () => {
                        try {
                            await addTodoMutation({ title });
                            setTitle("");
                        } catch(error){
                            console.log(error);
                        }
                    }}
                >
                    Add Todo
                </button>
            </div>
            {todos?.map((todo) => {
                return <TodoCard key={todo.id} todo={todo}/>
            })}
        </div>
    );
};