import React from 'react';
import { Flex, Text, Box, Card, Avatar } from "@radix-ui/themes";
import {
    Filter,
    useFrappeGetDocList,
    useFrappePostCall,
    useSWRConfig,
    useFrappeAuth,
    useFrappeGetCall,
    FrappeContext,
    FrappeConfig,
  } from "frappe-react-sdk";
  import { useContext,useState,useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';

const InstructorSchedule = () => {
    const { currentUser } = useFrappeAuth();
    const { call, db } = useContext(FrappeContext) as FrappeConfig;
    const [instructorId, setInstructorId] = useState("");
    const navigate = useNavigate();
    const fetchInstructorId = async () => {
        if (!currentUser) {
          // Check if currentUser is available
          console.error("No currentUser found");
          return;
        }
    
        const updatedFields = {
          doctype: "Instructor", // Fixing the single quote issue
          filters: [["linked_user", "=", currentUser]],
          fieldname: "name",
        };
    
        try {
          const res = await call.post("frappe.client.get_value", updatedFields);
          setInstructorId(res?.message?.name);
          console.log(res);
        } catch (error) {
          console.error("Error fetching instructor ID:", error);
        }
      };
    
      useEffect(() => {
        if (currentUser) {
          fetchInstructorId();
        }
      }, [currentUser]);

      const handleClassCountClick = () => {
        navigate('/channel/schedule');
    };
    const handleServiceCountClick = () => {
        navigate('/channel/service-schedule');
    };
    const handleAppointmentCountClick = () => {
        navigate('/channel/appoinment');
    };

      const { data, isLoading, error } = useFrappeGetCall<any>(
        `go_gym.api.routes.base.instructor_api?action=get_todays_schedule&instructor_id=${instructorId}`,
        {}
      );

      console.log(data?.message?.data)

      if (isLoading) {
        return <Text>Loading schedule...</Text>;
    }

    if (error) {
        return <Text color="red">Error loading schedule. Please try again.</Text>;
    }

  return (
    <Flex direction='column' gap='8' px='6' py='4'>
      <Flex justify='between' align='center'>
        <Flex direction='column' gap='0'>
          <Text size='3' className='font-semibold'>Schedule Highlights</Text>
          <Text size='1' color='gray'>Overview of today's classes, services, and appointments</Text>
        </Flex>
      </Flex>

      <Flex wrap='wrap' justify='center' gap='4' align='center'>
        {/* Class Count Card */}
        <Box width="100%" onClick={handleClassCountClick} maxWidth="400px">
          <Card size="2">
            <Flex gap="4" align="center">
              <Avatar size="4" radius="full" fallback="C" color="indigo" />
              <Box>
                <Text as="div" weight="bold">{data?.message?.data?.class_count}</Text>
                <Text as="div" color="gray">Class Count</Text>
              </Box>
            </Flex>
          </Card>
        </Box>

        {/* Service Count Card */}
        <Box width="100%" onClick={handleServiceCountClick} maxWidth="400px">
          <Card size="2">
            <Flex gap="4" align="center">
              <Avatar size="4" radius="full" fallback="S" color="indigo" />
              <Box>
                <Text as="div" weight="bold">{data?.message?.data?.service_count}</Text>
                <Text as="div" color="gray">Service Count</Text>
              </Box>
            </Flex>
          </Card>
        </Box>

        {/* Appointment Count Card */}
        <Box width="100%" onClick={handleAppointmentCountClick} maxWidth="400px">
          <Card size="2">
            <Flex gap="4" align="center">
              <Avatar size="4" radius="full" fallback="A" color="indigo" />
              <Box>
                <Text as="div" weight="bold">{data?.message?.data?.appointment_count}</Text>
                <Text as="div" color="gray">Appointment Count</Text>
              </Box>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Flex>
  );
};
export const Component = InstructorSchedule

