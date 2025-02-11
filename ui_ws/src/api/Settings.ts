import { RobotSettings, SystemSettings, MoveSettings } from "../entities/settings";

export const fetchSettings = async (): Promise<RobotSettings | undefined> => {
    
    console.log('fetch settings');

    try {
        const resp = await fetch("http://172.27.0.4:3000/v1/settings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(resp.status != 200 && !resp.ok){
            throw new Error("Failed to fetch settings");
        };

        const data = await resp.json();
        
        // schema convert
        const settings: RobotSettings = {
            system: {
                robot_name: data.system.robot_name,
                map: data.system.map,
                initial_pose_x: data.system.initial_pose_x,
                initial_pose_y: data.system.initial_pose_y,
                initial_pose_yaw: data.system.initial_pose_yaw
            },
            move: {
                max_linear_speed: data.move.max_linear_speed,
                max_angular_speed: data.move.max_angular_speed
            }
        };

        return settings;

    } catch(error){

        console.log(error);

    }
}

export const setSystemSettings = async ( { parameters }: SystemSettings) => {

    try{
        const resp = await fetch("http://172.27.0.4/v1/settings/system",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parameters)
        });
        
        if(resp.status !== 200 && !resp.ok){
            throw new Error("Failed to set system settings")
        }

        const data = await resp.json();

    } catch(error) { 
        throw new Error(error);
    }

}

export const setMoveSettings = async ({ parameters }: MoveSettings) => {

    try{
        const resp = await fetch("http://172.27.0.4/v1/settings/move",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parameters)
        });
        
        if(resp.status !== 200 && !resp.ok){
            throw new Error("Failed to set system settings")
        }

        const data = await resp.json();

    } catch(error) { 
        throw new Error(error);
    }

}