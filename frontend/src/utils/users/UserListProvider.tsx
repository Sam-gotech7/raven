import { useFrappeDocTypeEventListener, useFrappeGetCall, useSWRConfig } from "frappe-react-sdk";
import { PropsWithChildren, createContext, useMemo } from "react";
import { ErrorBanner } from "@/components/layout/AlertBanner";
import { FullPageLoader } from "@/components/layout/Loaders";
import { Box, Flex, Link } from "@radix-ui/themes";
import { RavenUser } from "@/types/Raven/RavenUser";


export const UserListContext = createContext<{ users: UserFields[], enabledUsers: UserFields[], enabledInstructors:any, enabledMembers:any }>({
    users: [],
    enabledUsers: [],
    enabledInstructors: [],
    enabledMembers:[]
})

export type UserFields = Pick<RavenUser, 'name' | 'full_name' | 'user_image' | 'first_name' | 'enabled' | 'type' | 'availability_status' | 'custom_status' | 'is_instructor'>

export const UserListProvider = ({ children }: PropsWithChildren) => {


    const { mutate: globalMutate } = useSWRConfig()
    const { data, error: usersError, mutate, isLoading } = useFrappeGetCall<{ message: UserFields[] }>('raven.api.raven_users.get_list', undefined, 'raven.api.raven_users.get_list', {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    /** TODO: If a bulk import happens, this gets called multiple times potentially causing the server to go down.
     * Instead, throttle this - wait for all events to subside
     */
    useFrappeDocTypeEventListener('Raven User', () => {
        mutate()

        // Mutate the channel list as well
        globalMutate(`channel_list`)
    })

    const { users, enabledUsers, enabledInstructors, enabledMembers } = useMemo(() => {
        return {
            users: data?.message ?? [],
            enabledUsers: data?.message?.filter(user => user.enabled === 1) ?? [],
            enabledInstructors: data?.message?.filter(user => user.enabled === 1 && user.is_instructor == true) ?? [],
            enabledMembers: data?.message?.filter(user => user.enabled === 1 && user.is_instructor == false) ?? []

        }
    }, [data])

    if (isLoading) {
        return <FullPageLoader />
    }
    if (usersError) {
        return <Flex align='center' justify='center' px='4' mx='auto' className="w-[50vw] h-screen">
            <ErrorBanner error={usersError}>
                <Box py='2'>
                    <Link href={'/app/raven-user'}>View Redee Chat Users</Link>
                </Box>
            </ErrorBanner>
        </Flex>
    }

    return <UserListContext.Provider value={{ users, enabledUsers, enabledInstructors,enabledMembers }}>
        {children}
    </UserListContext.Provider>
}