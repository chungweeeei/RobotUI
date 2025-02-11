/* 
    In TypeScript, and interface is a way to define
    the shape of an object. It specifies the properties and their types that an object should have.
    
    Interfaces are used to enforce type checking and ensure that objects conform to a specific structure.

    - export: This keyword makes the Todo interface available for import in other files.
    - interface: This keyword is used to define an interface.
    - Todo: The name of the interface
    
    inside is all properties in the object.
*/ 

export interface Todo {
    id: number,
    title: string,
    completed: boolean
};
