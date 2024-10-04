import { ChannelList } from '../../feature/channels/ChannelList'
import { DirectMessageList } from '../../feature/direct-messages/DirectMessageList'
import { SidebarItem } from './SidebarComp'
import { AccessibleIcon, Box, Flex, ScrollArea, Text } from '@radix-ui/themes'
import useUnreadMessageCount from '@/hooks/useUnreadMessageCount'
import PinnedChannels from './PinnedChannels'
import React, { useState } from 'react'
import { BiMessageAltDetail } from 'react-icons/bi'
import { LuBookmark } from 'react-icons/lu'
import { MdSportsGymnastics } from "react-icons/md";
import { LuBookOpen } from "react-icons/lu";
import { isGymMemberonly } from '@/utils/roles'


export const SidebarBody = () => {
    const [isMember, setMember] = useState(false);

    const unread_count = useUnreadMessageCount()
    const isGymMemberUser = isGymMemberonly()

    return (
        <ScrollArea type="hover" scrollbars="vertical" className='h-[calc(100vh-7rem)]'>
            <Flex direction='column' gap='2' className='overflow-x-hidden pb-12 sm:pb-0' px='2'>
                <Flex direction='column' gap='1' className='pb-0.5'>
                    <SidebarItemForPage
                        to={'threads'}
                        label='Threads'
                        icon={<BiMessageAltDetail className='text-gray-12 dark:text-gray-300 mt-1 sm:text-sm text-base' />}
                        iconLabel='Threads' />
                    <SidebarItemForPage
                        to={'saved-messages'}
                        label='Saved'
                        icon={<LuBookmark className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />}
                        iconLabel='Saved Message' />
                        { isGymMemberUser ? (
                        <>
                            <SidebarItemForPage
                                to={'workout'}
                                label='Workout'
                                icon={<MdSportsGymnastics className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />}
                                iconLabel='Workout' />
                            <SidebarItemForPage
                                to={'class'}
                                label='Class'
                                icon={<LuBookOpen className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />}
                                iconLabel='Class' />
                        </>
                    ) : null}
                        
                    <PinnedChannels unread_count={unread_count?.message} />
                </Flex>
                <ChannelList unread_count={unread_count?.message} />
                <DirectMessageList unread_count={unread_count?.message} />
            </Flex>
        </ScrollArea>
    )
}

interface SidebarItemForPageProps {
    to: string
    label: string
    icon: React.ReactNode
    iconLabel: string
}

const SidebarItemForPage = ({ to, label, icon, iconLabel }: SidebarItemForPageProps) => {
    return (
        <Box>
            <SidebarItem to={to} className='py-1'>
                <AccessibleIcon label={iconLabel}>
                    {icon}
                </AccessibleIcon>
                <Box>
                    <Text size={{
                        initial: '3',
                        md: '2'
                    }} weight='bold' className='text-gray-12 dark:text-gray-300'>{label}</Text>
                </Box>
            </SidebarItem>
        </Box>
    )
}