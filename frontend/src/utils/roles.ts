export const hasRavenUserRole = () => {

    if (import.meta.env.DEV) {
        return true
    }
    //@ts-expect-error
    return (window?.frappe?.boot?.user?.roles ?? []).includes('Raven User');
}

export const isSystemManager = () => {
    //@ts-expect-error
    return (window?.frappe?.boot?.user?.roles ?? []).includes('System Manager');
}


export const isGymInstructor = () => {
    //@ts-expect-error
    return (window?.frappe?.boot?.user?.roles ?? []).includes('Gym Instructor');
}

export const isGymMember = () => {
    //@ts-expect-error
    return (window?.frappe?.boot?.user?.roles ?? []).includes('Gym Member');
}
export const isGymMemberonly = () =>{
    return  isGymMember() 
    && !isGymInstructor() && !isSystemManager()
}

export const hasServerScriptEnabled = () => {
    if (import.meta.env.DEV) {
        return true
    }
    // @ts-expect-error
    return (window?.frappe?.boot?.server_script_enabled)
}

export const ApiUrl = 'http://192.168.1.105:8003/api/method/go_gym.api.routes.base.instructor_api?'