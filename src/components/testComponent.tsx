import { useState } from "react";
import { createContext, useContext } from "react";

type Props = {
    isLight: boolean;
}

function Card({isLight}: Props){
    return (
        <div style={{backgroundColor: isLight ? "#ccc" : "#333"}}>
            <p style={{color: isLight ? "#333" : "#ccc"}}>My Card</p>
        </div>
    );
}

function Board({isLight}: Props){
    return (
        <div>
            <p>Board</p>
            <Card isLight={isLight} />
        </div>
    )
}

export function TestComponent(){

    /* 
        hear we utilize react useState to register a boolean state (isLight flag)
        and send this state via props to child component in order to control 
        the color in the card component.

        When we take a look at the Board Component, it only pass the props to the 
        Card component.

        Under this situation, when the project become larger and large it is hard
        to trace the props.
    */

    const [isLight, setIsLight] = useState<boolean>(false);

    function toggleLight(){
        setIsLight(!isLight);
    }

    return(
        <>
            <div style={{display: "flex"}}>
                <Board  isLight={isLight}/>
            </div>
            <button onClick={toggleLight}>Toggle Light</button>
        </>
    );
}

/* 
    We can use the combination of createContext and useContext to deal with the above difficulty (props drilling issue). 

    Syntax: createContext
    const SomeContext = createContext(defaultValue)

    SomeContext need to start with capital character. This is a context object, there are two properties that we must need to know.

    1. SomeContext.Provider: Let us provide data to the children component
    2. SomeContext.Consumer: Let us can obtain the value that SomeContext.Provider
*/ 

const LightContext = createContext(false);

function CardContext(){

    // return (
    //     <LightContext.Consumer>
    //         {
    //             (value) => (
    //                 <div style={{backgroundColor: value ? "#ccc" : "#333"}}>
    //                     <p style={{color: value ? "#333" : "#ccc"}}>My Card</p>
    //                 </div>
    //             )
    //         }
    //     </LightContext.Consumer>
    // )

    /* 
        Mostly we are using useContext rather than use Conext.Consumer
        useContext is a syntax for  Conext.Consumer

        we do not wrap specific area with Context.Consumer
    */ 

    const value = useContext(LightContext);

    return (
        <div style={{backgroundColor: value ? "#ccc" : "#333"}}>
            <p style={{color: value ? "#333" : "#ccc"}}>My Card</p>
        </div>
    )
}

function BoardContext(){
    return(
        <div style={{margin: "10px"}}>
            <p>Board</p>
            <CardContext />
        </div>
    )
}

export function TestContextComponent() {

    const [isLight, setIsLight] = useState<boolean>(false);

    function toggleLight(){
        setIsLight(!isLight);
    }

    /*
        wrap up the shared data into value properties.

        Then you can get the value in childer component via Comsumer. Mostly utilze useContext to get value.
    */

    return (
        <>
            <div style={{ display: "flex" }}>
              <LightContext.Provider value={isLight}>
                <BoardContext />
              </LightContext.Provider>
            </div>
            <button onClick={toggleLight}>Toggle Light</button>
        </>
    )
}

