import { useState, useEffect, useContext } from "react";
import { Heading, Text, Flex, Box, Separator, Avatar } from "@radix-ui/themes";
import QRCode from "react-qr-code";
import { useTheme } from "@/ThemeProvider";
import { useFrappeAuth, FrappeContext, FrappeConfig } from "frappe-react-sdk"; 
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
  image: string;
}

// Define the props for the component
interface ClassDetailsProps {
  data: ClassData;
}

const ClassDetails: React.FC<ClassDetailsProps> = ({ data }) => {
  const { appearance } = useTheme();
  const { currentUser } = useFrappeAuth();
  const { call, db } = useContext(FrappeContext) as FrappeConfig;
  const isDarkMode = appearance === "dark";
  const [instructorId, setInstructorId] = useState("");
  const fetchInstructorId = async () => {
    if (!currentUser) {
      console.error("No currentUser found");
      return;
    }

    const updatedFields = {
      doctype: "Instructor",
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
      console.log(currentUser, "ghsBSCJHsDJHGdSHdSkh");
      fetchInstructorId();
    }
  }, [currentUser]);
  const containerClass = isDarkMode
    ? "bg-[#26292B] text-gray-100"
    : "bg-white text-gray-900";
  const sectionBgClass = isDarkMode ? "bg-gray-700" : "bg-gray-100";
  const borderClass = isDarkMode ? "border-gray-600" : "border-gray-300";

  return (
    <Box className={`p-6 shadow-lg w-full rounded-md ${containerClass}`}>
      <Box className="mb-4 w-full">
        <Avatar
          src={data?.image}
          alt="Class Image"
          className="w-full h-[300px] object-cover rounded-md"
        />
      </Box>

      <Heading size="6" className="mb-2">
        {data?.title || "Class Title"}
      </Heading>

      <Separator className="mb-4" />

      <Flex direction="column" gap="2" className="w-full">
        <Flex justify="between" mb="2">
          <Text weight="bold">Category</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.class_category}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Price</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.is_paid ? `₹ ${data.price}` : "Free"}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Date</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.schedule_date}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Time</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {new Date(data?.start_time).toLocaleTimeString()} -{" "}
            {new Date(data?.end_time).toLocaleTimeString()}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Status</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.status}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Instructor</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.instructor_name} ({data?.instructor_email})
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Company</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.company}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Location</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.location}
          </Text>
        </Flex>

        <Flex justify="between" mb="2">
          <Text weight="bold">Capacity</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.booked_seats} / {data?.maximum_capacity} seats booked
          </Text>
        </Flex>

        <Flex justify="between">
          <Text weight="bold">Available Seats</Text>
          <Text className={isDarkMode ? "gray-300" : "gray-700"}>
            {data?.available_seats}
          </Text>
        </Flex>
      </Flex>

      <Separator className="my-6" />

      <Box
        className={`flex flex-col items-center p-4 rounded-md shadow-sm border ${sectionBgClass} ${borderClass}`}
      >
        <Text
          weight="bold"
          className={`mb-4 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } text-lg`}
        >
          Scan QR Code
        </Text>
        <Box className="p-2 bg-white rounded-md shadow-md">
          <QRCode value={`${instructorId}&${data?.class_id}`} size={120} />{" "}
        </Box>
        <Text
          className={`mt-4 text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Use this code to mark as attended
        </Text>
      </Box>
    </Box>
  );
};

export default ClassDetails;
