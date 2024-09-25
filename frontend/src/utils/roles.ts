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

export const hasServerScriptEnabled = () => {
    if (import.meta.env.DEV) {
        return true
    }
    // @ts-expect-error
    return (window?.frappe?.boot?.server_script_enabled)
}