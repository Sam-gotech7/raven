import React from 'react';
import { Heading, Text, Flex, Box, Separator, Avatar } from '@radix-ui/themes';
import { useFrappeGetDoc } from "frappe-react-sdk";

// Define the type for the `data` prop
interface ClassData {
  class_id: string;
  title: string;
  class_category: string;
  is_paid: number;
  price: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  status: string;
  instructor_id: string;
  instructor_name: string;
  instructor_email: string;
  company: string;
  location: string;
  maximum_capacity: number;
  available_seats: number;
  booked_seats: number;
  image: string
}

// Define the props for the component
interface ClassDetailsProps {
  data: ClassData;
}

const ClassDetails: React.FC<ClassDetailsProps> = ({ data }) => {
 
  return (
    <Box className="p-6 text-gray-100 shadow-lg w-full">
      {/* Class Image */}
      <Box className="mb-4 w-full">
        <Avatar
          src={data?.image} // Replace with the actual path to your class image
          alt="Class Image"
          className="w-full h-[300px] object-cover rounded-md"
        />
      </Box>

      {/* Class Title */}
      <Heading size="6" className="mb-2">
        {data?.title || "Class Title"}
      </Heading>

      {/* Separator */}
      <Separator className="mb-4" />

      {/* Class Details in a side-by-side layout */}
      <Flex direction="column" gap="2" className="w-full">
        <Flex justify="between" mb="2">
          <Text weight="bold">Category</Text>
          <Text color="gray">Service</Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Price</Text>
          <Text color="gray">{data?.is_paid ? `₹ ${data.price}` : 'Free'}</Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Date</Text>
          <Text color="gray">{data?.start_time?.split(' ')[0]}</Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Time</Text>
          <Text color="gray">
            {new Date(data?.start_time).toLocaleTimeString()} - {new Date(data?.end_time).toLocaleTimeString()}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Status</Text>
          <Text color="gray">{data?.status}</Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Instructor</Text>
          <Text color="gray">{data?.instructor_name} ({data?.instructor_email})</Text>
        </Flex>

      
        <Flex justify="between" mb="2">
          <Text weight="bold">Location</Text>
          <Text color="gray">{data?.location}</Text>
        </Flex>

       

        
      </Flex>
    </Box>
  );
};

export default ClassDetails;
