import { ErrorText, Label } from "@/components/common/Form";
import { Loader } from "@/components/common/Loader";
import { Box, Button, Flex, Text, Card } from "@radix-ui/themes";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Label as RadixLabel } from "@radix-ui/react-label";
import { FiCheck, FiClock, FiPlus, FiTrash } from "react-icons/fi"; 
import { useFrappeUpdateDoc, FrappeConfig, FrappeContext,useFrappeAuth,useFrappeGetDoc  } from "frappe-react-sdk";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import useCurrentRavenUser from "@/hooks/useCurrentRavenUser";
import { useState,useEffect,useContext } from "react";
import Select from "react-select"; 
import { useIsDesktop, useIsMobile } from "@/hooks/useMediaQuery";
import { useTheme } from "@/ThemeProvider";
type Slot = {
  day: string;
  startTime: string;
  endTime: string;
};

type UserProfile = {
  full_name?: string;
  user_image?: string;
  availability_status?: string;
  custom_status?: string;
};

export const AppointmentDetails = () => {
  const { myProfile, mutate } = useCurrentRavenUser();
  const [appointmentEnabled, setAppointmentEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [holidayList, setHolidayList] = useState('');
  const [slots, setSlots] = useState<Slot[]>([{ day: "", startTime: "", endTime: "" }]);
  const { appearance } = useTheme();
  const { currentUser } = useFrappeAuth()
  const [instructorId, setInstructorId] = useState('');
  const { data: profileDta } = useFrappeGetDoc('Instructor', instructorId);
  const { call,db } = useContext(FrappeContext) as FrappeConfig;
  const handleAppointmentToggle = () => {
    setAppointmentEnabled((prev) => !prev);
  };

  const handleDurationChange = (e: any) => {
    setDuration(e.target.value);
  };

  const addSlot = () => {
    setSlots([...slots, { day: "Monday", startTime: "14:00", endTime: "16:00" }]);
  };

  const removeSlot = (index: number) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
  };

  const updateSlot = (index: number, key: keyof Slot, value: string) => {
    const updatedSlots = slots?.map((slot, i) => (i === index ? { ...slot, [key]: value } : slot));
    setSlots(updatedSlots);
  };

  const handleHolidayListChange = (selectedOption: any) => {
    setHolidayList(selectedOption);
  };

  useEffect(() => {
    if (profileDta) {
      // Check if values exist in profileDta and set state accordingly
      if (profileDta.enable_appointment_scheduling !== undefined) {
        setAppointmentEnabled(profileDta.enable_appointment_scheduling === 1);
      }
      if (profileDta.appointment_duration) {
        setDuration(profileDta.appointment_duration);
      }
      if (profileDta.holiday_list) {
        setHolidayList(profileDta.holiday_list);
      }
      if (profileDta && profileDta.weekly_schedule) {
        // Format the time to ensure it's in "HH:MM:SS" format
        const formattedSlots = profileDta.weekly_schedule.map((slot: any) => {
          const formatTime = (time: string) => {
            // If time is already in HH:MM:SS format, return it as is
            // Otherwise, append ':00' to make it HH:MM:SS
            return time.length === 5 ? `${time}:00` : time;
          };
    
          return {
            day: slot.day,
            startTime: formatTime(slot.from_time),  // Ensure time is in HH:MM:SS format
            endTime: formatTime(slot.to_time),      // Ensure time is in HH:MM:SS format
          };
        });

        setSlots(formattedSlots);
      }
    }
  }, [profileDta]);

  console.log('gjjhhcf',slots)

  if (!profileDta) {
    return <p>Loading...</p>;
  }

  const methods = useForm<UserProfile>({
    defaultValues: {
      full_name: myProfile?.full_name ?? "",
      user_image: myProfile?.user_image ?? "",
      availability_status: myProfile?.availability_status ?? "",
      custom_status: myProfile?.custom_status ?? "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = methods;
  const { updateDoc, loading: updatingDoc, error } = useFrappeUpdateDoc();
  const fetchInstructorId = async () => {
    if (!currentUser) {
      // Check if currentUser is available
      console.error('No currentUser found');
      return;
    }

    const updatedFields = {
      doctype: 'Instructor', // Fixing the single quote issue
      filters: [['linked_user', '=', currentUser]],
      fieldname: 'name'
    };

    try {
      const res = await call.post('frappe.client.get_value', updatedFields);
      setInstructorId(res?.message?.name)
      console.log(res);
    } catch (error) {
      console.error('Error fetching instructor ID:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchInstructorId();
    }
  }, [currentUser]);
  const onSubmit = (event: any) => {
    const newSlots = slots?.map((slot: any) => ({
        "doctype": "Weekly Schedule",
        "day": slot?.day,
        "to_time":slot?.endTime,
        "from_time":slot?.startTime
    }));
    db.updateDoc('Instructor', instructorId, {
        enable_appointment_scheduling:appointmentEnabled,
        appointment_duration:duration,
        weekly_schedule:newSlots

      })
        .then((doc) => console.log(doc))
        .catch((error) => console.error(error));
  };

  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const holidayOptions = [
    { value: "India Holiday List", label: "India Holiday List" },
    { value: "UK Holiday List", label: "UK Holiday List" },
    { value: "UAE Holiday List", label: "UAE Holiday List" },
  ];

  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  
  return (
    <Flex direction="column" gap="4" px={isMobile ? "4" : "6"} py="4" style={{ maxWidth: "100%" }}>
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4">
          <Flex
            justify="between"
            align="center"
            direction={isMobile ? "column" : "row"}
          >
            <Flex direction="column" gap="0">
              <Text size="3" className="font-semibold">
                Appointment Setting
              </Text>
              <Text size="1" color="gray">
                Manage your appointments
              </Text>
            </Flex>
            <Button
              type="submit"
              disabled={updatingDoc}
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : "200px", // Full width on mobile
                marginTop: isMobile ? "16px" : "8px", // Add more spacing on mobile
              }}
            >
              {updatingDoc && <Loader />}
              {updatingDoc ? "Saving" : "Save"}
            </Button>
          </Flex>
  
          <Card className="p-0 align-middle justify-center" style={{ width: isMobile ? "100%" : "auto" }}>
            <Flex direction="column" gap="4" p="4">
              {/* Appointment Enable Checkbox */}
              <Flex align="center" gap="2">
                <Checkbox
                  id="enableAppointment"
                  checked={appointmentEnabled}
                  onCheckedChange={handleAppointmentToggle}
                  className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center"
                >
                  {appointmentEnabled && <FiCheck size={16} color="black" />}
                </Checkbox>
                <RadixLabel htmlFor="enableAppointment">
                  Enable Appointment Scheduling
                </RadixLabel>
              </Flex>
  
              
              <Flex
                direction={isMobile ? "column" : "row"} 
                gap="4"
                justify="between"
              >
                <Box style={{ flex: 1 }}>
                    <RadixLabel htmlFor="holidayList">Holiday List <Text color="red">*</Text></RadixLabel>
                    <input
                      type="text"
                      id="holidayList"
                      value={holidayList}
                      readOnly
                      style={{
                        width: "98%",
                        padding: "8px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "6px",
                        backgroundColor: appearance === "dark" ? "#333" : "#f5f5f5",
                        color: appearance === "dark" ? "#fff" : "#000",
                      }}
                    />
                    <Text size="2" color="gray">Please set Holiday List in Employee Master</Text>
                  </Box>


  
                <Box style={{ flex: 1 }}>
                  <RadixLabel htmlFor="appointmentDuration">
                    Duration <Text color="red">*</Text>
                  </RadixLabel>
                  <input
                    type="number"
                    id="appointmentDuration"
                    value={duration}
                    onChange={handleDurationChange}
                    style={{
                      width: "98%",
                      padding: "8px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      backgroundColor: appearance === "dark" ? "#333" : "#fff",
                    }}
                  />
                  <Text size="2" color="gray">
                    In Minutes
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Card>
  
          
<Card className="p-0 align-middle justify-center mt-4" style={{ width: isMobile ? '100%' : 'auto' }}>
  <Flex direction="column" gap="4" p="4">
    <Text size="3" className="font-semibold">
      My availability
    </Text>

    {slots.map((slot, index) => (
      <Flex
        direction="column" 
        gap="4"
        align="center"
        key={index}
        style={{ width: "100%" }} 
      >
        {/* Day Dropdown */}
        <Box style={{ width: "100%" }}> 
          <RadixLabel htmlFor={`day-${index}`}>Day</RadixLabel>
          <Select
            id={`day-${index}`}
            options={dayOptions}
            value={dayOptions.find((option) => option.value === slot.day)} 
            onChange={(option) => updateSlot(index, "day", option?.value || "Monday")}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: appearance === "dark" ? "#333" : "#fff",
                borderColor: state.isFocused ? "#007BFF" : "#444",
                boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                "&:hover": {
                  borderColor: state.isFocused ? "#007BFF" : "#666",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: appearance === "dark" ? "#333" : "#fff",
                color: appearance === "dark" ? "#fff" : "#000",
              }),
              option: (baseStyles, { isFocused }) => ({
                ...baseStyles,
                backgroundColor: isFocused ? (appearance === "dark" ? "#555" : "#eee") : "transparent",
                color: appearance === "dark" ? "#fff" : "#000",
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: appearance === "dark" ? "#fff" : "#000",
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                color: appearance === "dark" ? "#fff" : "#000",
              }),
            }}
          />
        </Box>

        {/* Start Time */}
        <Box style={{ width: "100%" }}> {/* Full width */}
          <RadixLabel htmlFor={`startTime-${index}`}>Start Time</RadixLabel>
          <Flex align="center" style={{ width: "100%" }}>
            <input
              type="time"
              id={`startTime-${index}`}
              value={slot.startTime}
              onChange={(e) => updateSlot(index, "startTime", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                backgroundColor: appearance === "dark" ? "#333" : "#fff",
              }}
            />
            <FiClock size={16} style={{ marginLeft: "8px" }} />
          </Flex>
        </Box>

        {/* End Time */}
        <Box style={{ width: "100%" }}> {/* Full width */}
          <RadixLabel htmlFor={`endTime-${index}`}>End Time</RadixLabel>
          <Flex align="center" style={{ width: "100%" }}>
            <input
              type="time"
              id={`endTime-${index}`}
              value={slot.endTime}
              onChange={(e) => updateSlot(index, "endTime", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                backgroundColor: appearance === "dark" ? "#333" : "#fff",
              }}
            />
            <FiClock size={16} style={{ marginLeft: "8px" }} />
          </Flex>
        </Box>

        {/* Remove Slot Button */}
        {/* Remove Slot Button */}
<Box style={{ width: "100%" }}>
  <Button
    variant="ghost"
    size="small"
    onClick={() => removeSlot(index)}
    style={{ color: "red", alignSelf: "flex-end" }}
  >
    <FiTrash size={24} /> {/* Increased size from default (16px) to 24px */}
  </Button>
</Box>

      </Flex>
    ))}

    {/* Add Slot Button */}
    <Flex>
      <Button
        onClick={addSlot}
        size="small"
        style={{
          width: "100%",
          backgroundColor: "#635BFF",
        }}
      >
        <FiPlus style={{ marginRight: "4px" }} />
        Add Slot
      </Button>
    </Flex>
  </Flex>
</Card>

        </Flex>
      </form>
    </FormProvider>
  </Flex>
  
  );
};
