import { SidebarGroup, SidebarGroupItem, SidebarGroupLabel, SidebarGroupList } from "../layout/Sidebar"
import { SidebarViewMoreButton } from "../layout/Sidebar/SidebarComp"
import { Flex, Text } from "@radix-ui/themes"
import { useState, useRef, useLayoutEffect } from "react"
import { FaTools, FaChalkboardTeacher } from "react-icons/fa"
import { Link } from "react-router-dom"  // Import Link for routing
import { BiBookmark, BiMessageAltDetail } from 'react-icons/bi'
import { MdSchedule,MdCalendarToday } from 'react-icons/md'
import { FaCalendarCheck, FaServicestack } from 'react-icons/fa';
import { MdSportsGymnastics } from "react-icons/md";
import { LuBookOpen } from "react-icons/lu";
export const InstructorHubSidebar = () => {
    const [showServices, setShowServices] = useState(false);

    const toggleServices = () => setShowServices((prev) => !prev);

    const servicesRef = useRef<HTMLDivElement>(null);
    const [servicesHeight, setServicesHeight] = useState(showServices ? servicesRef?.current?.clientHeight ?? 0 : 0);

    useLayoutEffect(() => {
        setServicesHeight(servicesRef.current?.clientHeight ?? 0);
    }, [showServices]);

    return (
        <SidebarGroup>
            <SidebarGroupItem className={'gap-1 pl-1'}>
                <Flex width='100%' justify='between' align='center' className="group cursor-pointer" onClick={toggleServices}>
                    <SidebarGroupLabel className="text-md">Instructor Hub</SidebarGroupLabel>
                    <SidebarViewMoreButton expanded={showServices} onClick={toggleServices} />
                </Flex>
            </SidebarGroupItem>
            <SidebarGroupList
                style={{
                    height: showServices ? servicesHeight : 0,
                }}
            >
                <div ref={servicesRef} className="flex gap-0.5 flex-col">
                    <Link to="/channel/instructorhighlight" className="no-underline text-current"> 
                        <Flex align="center" gap="2" className="pl-4 cursor-pointer">
                            <MdCalendarToday className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />
                            <Text  as="span">Highlight</Text>
                        </Flex>
                    </Link>

                    <Link to="/channel/schedule" className="no-underline text-current"> 
                        <Flex align="center" gap="2" className="pl-4 cursor-pointer">
                            <MdSchedule className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />
                            <Text as="span">Class Schedule</Text>
                        </Flex>
                    </Link>


                    <Link to="/channel/service-schedule" className="no-underline text-current">
                        <Flex align="center" gap="2" className="pl-4 cursor-pointer">
                            <FaServicestack className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />
                            <Text as="span">Service Schedule</Text>
                        </Flex>
                    </Link>


                    <Link to="/channel/appoinment" className="no-underline text-current"> 
                        <Flex align="center" gap="2" className="pl-4 cursor-pointer">
                            <FaTools className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />
                            <Text as="span">Appoinments</Text>
                        </Flex>
                    </Link>

                    <Link to="/channel/workout" className="no-underline text-current"> 
                        <Flex align="center" gap="2" className="pl-4 cursor-pointer">
                            <MdSportsGymnastics className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />
                            <Text as="span">Workout</Text>
                        </Flex>
                    </Link>


                    <Link to="/channel/class" className="no-underline text-current"> 
                        <Flex align="center" gap="2" className="pl-4 cursor-pointer">
                            <LuBookOpen className='text-gray-12 dark:text-gray-300 mt-0.5 sm:text-sm text-base' />
                            <Text as="span">Class</Text>
                        </Flex>
                    </Link>
                   
                </div>
            </SidebarGroupList>
        </SidebarGroup>
    );
};
