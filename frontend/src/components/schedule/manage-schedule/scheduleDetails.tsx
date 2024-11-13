import React from 'react'
import { useLocation,Link } from 'react-router-dom';
import { LuFunctionSquare, LuSparkles } from 'react-icons/lu'
import { BiBot, BiFile } from 'react-icons/bi'
import { PageHeader } from '@/components/layout/Heading/PageHeader';
import { Heading } from "@radix-ui/themes"
import { Box, Flex ,Tabs} from '@radix-ui/themes'
import { BiChevronLeft } from "react-icons/bi"
import {UsersTable} from "./UsersTable"
import { useState } from 'react';
import ClassDetails from './ClassDetails';
const ScheduleDetails = () => {
    const location = useLocation();
    const [selected, setSelected] = useState<string[]>([]);

    const workout = location.state?.workout;
    const ICON_PROPS = {
        size: 18,
        className: 'mr-1.5'
    }
    console.log(workout?.enrollment_info)
  return (
  <>
  <PageHeader>
                <Flex align='center' gap='3' className="h-8">
                    <Link to='/channel/schedule' className="block bg-transparent hover:bg-transparent active:bg-transparent sm:hidden">
                        <BiChevronLeft size='24' className="block text-gray-12" />
                    </Link>
                    <Heading size='5'>Class Details</Heading>
                </Flex>
            </PageHeader>
<div className='mt-20'>
<Tabs.Root defaultValue='classDetails'>
    <Tabs.List>
        <Tabs.Trigger value='classDetails'><BiBot {...ICON_PROPS} /> Class Details</Tabs.Trigger>
    <Tabs.Trigger value='enrolledMembers'><LuSparkles {...ICON_PROPS} /> Enrolled Members</Tabs.Trigger> 
       
    </Tabs.List>
    <Box pt='4'>
        <Tabs.Content value='classDetails'>
            <ClassDetails data={workout}/>
        </Tabs.Content>
       
        <Tabs.Content value='enrolledMembers'>
            <UsersTable data={workout?.enrollment_info}    defaultSelected={[]}
            selected={selected}
            setSelected={setSelected} />
        </Tabs.Content>
        
    </Box>
</Tabs.Root>
</div>
  </>
  )
}

export default ScheduleDetails