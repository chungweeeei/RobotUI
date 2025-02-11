/* 
    Interface/Type alias can be used to describe the shape of an object or a function signature. But the syntax differs.
    It specifies the properties and their types that an object should have.
    
    Both are used to enforce type checking and ensure that objects conform to a specific structure.
    
    1. Object/Functions 

        Interface: 

        ```
            interface Point {
                x: number,
                y: number
            }

            interface setPoint {
                (x: number, y: number): void;
            }
        ```

        Type alias: 
    
        ```
            type Point = {
              x: number;
              y: number;
            };
            
            type SetPoint = (x: number, y: number) => void;
        ```

    2. Other Types(Like Primitive type)

        ```
            // primitive
            type Name = string;

            // object
            type PartialPointX = { x: number; };
            type PartialPointY = { y: number; };

            // union
            type PartialPoint = PartialPointX | PartialPointY;

            // tuple
            type Data = [number, string];
        ```
    
    3. Extend 

        Both can be extended, but again, the syntax differs. 
        Additionally, note that an interface and type alias are not mutually exclusive. 
        An interface can extend a type alias, and vice versa.

        ```
            interface PartialPointX { x: number; }
            interface Point extends PartialPointX { y: number; }
        ```


        ```
            type PartialPointX = { x: number; };
            type Point = PartialPointX & { y: number; };
        ```

        interface extends type alias
        
        ```
            type PartialPointX = { x: number; };
            interface Point extends PartialPointX { y: number; }
        ```


    daily development: 
    mostly use interface to describe a object, and use type to describe a function signature.

    ```
        interface Point {
          x: number;
          y: number;
        }

        type SetPoint = (x: number, y: number) => void;
    ```

    when using interface, i want it to be a Parent-Child relationship, 
    By contrast, when I use type, it only stands for 「Composition」relationship.

*/ 


export interface SystemSettings {
    robot_name: string,
    map: string,
    initial_pose_x: number,
    initial_pose_y: number,
    initial_pose_yaw: number
}

export interface MoveSettings {
    max_linear_speed: number,
    max_angular_speed: number
}

export type RobotSettings = {
    system: SystemSettings,
    move: MoveSettings
}