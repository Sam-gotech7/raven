import { User } from "@/types/Core/User"
import { useMemo } from "react"
import { Badge, Box, Checkbox, Flex, Table, Tooltip,Text ,Button,Avatar } from "@radix-ui/themes"
import { UserAvatar } from "@/components/common/UserAvatar"
import { StandardDate } from "@/utils/dateConversions"
import { FiAlertTriangle, FiEye, FiTrash } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
interface UsersTableProps {
    data: User[],
    defaultSelected: string[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export const UsersTable = ({ data, selected, setSelected, defaultSelected }: UsersTableProps) => {
    const navigate = useNavigate(); 
    const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

    const setAllChecked = (checked: boolean) => {
        if (checked) {
            setSelected((curr) => {
                const workout_array: string[] = []
                data.forEach(workout => {
                    if (!selected.includes(workout.name) && !defaultSelected.includes(workout.name)) {
                        workout_array.push(workout.name)
                    }
                })
                return [...curr, ...workout_array]
            })
        } else {
            setSelected([])
        }
    }

    const isAllChecked = useMemo(() => {
        if (data && data.length) {
            let allChecked = true
            data?.forEach(workout => {
                if (!selected.includes(workout.name) && !defaultSelected.includes(workout.name)) {
                    allChecked = false
                }
            })
            return allChecked
        }
        else {
            return false
        }
    }, [selected, data])

    const onCheckboxChange = (v: string) => {
        setSelected(curr => {
            if (curr.includes(v)) {
                return curr.filter((workout) => workout !== v)
            } else {
                return [...curr, v]
            }
        })
    }


    const handleViewClick = (workout: any) => {
        setSelectedWorkout(workout); // Set the selected workout data for the modal
    };
      
    return (
     <>
       <Dialog.Root open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <Dialog.Content 
                        className="fixed flex items-center justify-center"
                        style={{
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#18191B",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                            width: "500px",
                            maxWidth: "90%",
                            maxHeight: "90%",
                            overflowY: "auto"
                        }}
                    >
                        {selectedWorkout && (
                            <Box>
                                {/* Modal Heading */}
                                <Text size="6" weight="bold" style={{ color: "#FFFFFF", marginBottom: "16px", fontSize: '24px' }}>
                                    Class Details
                                </Text>
                                
                                {/* Workout Details */}
                                <Box style={{ color: "#CFCFCF", fontSize: "16px", lineHeight: "1.5", marginBottom: "16px" }}>
                                    <Flex direction="column" gap="2">
                                        <Text><strong>Class Title:</strong> {selectedWorkout.title}</Text>
                                        <Text><strong>Class ID:</strong> {selectedWorkout.class_id}</Text>
                                        <Text><strong>Instructor:</strong> {selectedWorkout.instructor_name}</Text>
                                        <Text><strong>Schedule Date:</strong> {selectedWorkout.schedule_date}</Text>
                                        <Text><strong>Start Time:</strong> {selectedWorkout.start_time}</Text>
                                        <Text><strong>End Time:</strong> {selectedWorkout.end_time}</Text>
                                        <Text><strong>Status:</strong> {selectedWorkout.status}</Text>
                                        <Text><strong>Location:</strong> {selectedWorkout.location}</Text>
                                        <Text><strong>Price:</strong> {selectedWorkout.price > 0 ? `₹${selectedWorkout.price}` : "Free"}</Text>
                                    </Flex>
                                </Box>

                                {/* Enrollment Info Section */}
                                {selectedWorkout.enrollment_info && selectedWorkout.enrollment_info.length > 0 && (
                                    <>
                                        <Text size="5" weight="bold" style={{ color: "#FFFFFF", marginBottom: "12px", fontSize: '20px' }}>
                                            Enrollment Details
                                        </Text>
                                        <Box style={{ color: "#CFCFCF", fontSize: "14px", lineHeight: "1.5" }}>
                                            {selectedWorkout.enrollment_info.map((member: any, index: number) => (
                                                <Box key={index} style={{ marginBottom: "12px", padding: "8px", borderRadius: "8px", backgroundColor: "#2A2B2E" }}>
                                                    <Flex align="center" gap="3">
                                                        <Avatar src={member.image} alt={member.member_name} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                                                        <Flex direction="column">
                                                            <Text><strong>Name:</strong> {member.member_name}</Text>
                                                            <Text><strong>Email:</strong> {member.email_id}</Text>
                                                            <Text><strong>Mobile:</strong> {member.mobile}</Text>
                                                            <Text><strong>Location:</strong> {member.location}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Box>
                                            ))}
                                        </Box>
                                    </>
                                )}

                                {/* Close Button */}
                                <Button onClick={() => setSelectedWorkout(null)} style={{ marginTop: "24px", width: "100%" }}>Close</Button>
                            </Box>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

     <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell><Checkbox checked={isAllChecked} onCheckedChange={(e) => setAllChecked(e.valueOf() ? true : false)} /></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Schedule Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data?.map((workout: any, index) => {
                    const isSelected = selected.includes(workout.class_id) || defaultSelected.includes(workout.class_id)
                    return (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell><Checkbox checked={isSelected} disabled={defaultSelected.includes(workout.class_id)} onCheckedChange={() => onCheckboxChange(workout.class_id)} /></Table.RowHeaderCell>
                            <Table.Cell>
                               {workout.class_id}
                            </Table.Cell>

                            <Table.Cell>{workout.title}</Table.Cell>
                            <Table.Cell>{workout.schedule_date}</Table.Cell>
                            <Table.Cell>{workout.status}</Table.Cell>
                            <Table.Cell>{workout.price}</Table.Cell>

                            <Table.Cell>
                            <Flex align="center" gap="2">
                                    <Tooltip content="Edit">
                                    <FiEye style={{ cursor: 'pointer' }} onClick={() => handleViewClick(workout)} />
                                    </Tooltip>
                                    
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
     </>
    )
}