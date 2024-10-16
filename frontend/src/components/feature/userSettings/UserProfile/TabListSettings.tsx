import { Box, Tabs } from '@radix-ui/themes'
import { LuFunctionSquare, LuSparkles } from 'react-icons/lu'
import { BiBot, BiFile } from 'react-icons/bi'
import UserProfile from './UserProfile'
import { PersonalDetails } from './PersonalDetails'
import { AppointmentDetails } from './AppoinmentDetails'
const ICON_PROPS = {
    size: 18,
    className: 'mr-1.5'
}

const TabListSettings = () => {

    return (
        <Tabs.Root defaultValue='userprofile'>
            <Tabs.List>
                <Tabs.Trigger value='userprofile'><BiBot {...ICON_PROPS} /> Profile</Tabs.Trigger>
            <Tabs.Trigger value='personaldetails'><LuSparkles {...ICON_PROPS} /> Personal Details</Tabs.Trigger> 
             <Tabs.Trigger value='appointment'><BiFile {...ICON_PROPS} /> Appointment</Tabs.Trigger> 
               
            </Tabs.List>
            <Box pt='4'>
                <Tabs.Content value='userprofile'>
                    <UserProfile />
                </Tabs.Content>
               
                <Tabs.Content value='personaldetails'>
                    <PersonalDetails />
                </Tabs.Content>
                <Tabs.Content value='appointment'>
                    <AppointmentDetails />
                </Tabs.Content>
            </Box>
        </Tabs.Root>
    )
}

export default TabListSettings