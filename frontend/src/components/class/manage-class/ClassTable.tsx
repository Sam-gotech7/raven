import { User } from "@/types/Core/User"
import { useMemo } from "react"
import { Badge, Box, Checkbox, Flex, Table, Tooltip } from "@radix-ui/themes"
import { UserAvatar } from "@/components/common/UserAvatar"
import { StandardDate } from "@/utils/dateConversions"
import { FiAlertTriangle, FiEdit, FiTrash } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
interface UsersTableProps {
    data: User[],
    defaultSelected: string[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export const UsersTable = ({ data, selected, setSelected, defaultSelected }: UsersTableProps) => {
    const navigate = useNavigate(); 
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


    const handleEditClick = (workoutName: string) => {
        const formattedWorkoutName = workoutName.replace(/\s+/g, '-');
        console.log(formattedWorkoutName)
        navigate(`/channel/class/edit/${formattedWorkoutName}`);  
      };
      
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell><Checkbox checked={isAllChecked} onCheckedChange={(e) => setAllChecked(e.valueOf() ? true : false)} /></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data?.map((workout: any, index) => {
                    const isSelected = selected.includes(workout.name) || defaultSelected.includes(workout.name)
                    return (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell><Checkbox checked={isSelected} disabled={defaultSelected.includes(workout.name)} onCheckedChange={() => onCheckboxChange(workout.name)} /></Table.RowHeaderCell>
                            <Table.Cell>
                               {workout.name}
                            </Table.Cell>

                            <Table.Cell>{workout.class_title}</Table.Cell>
                            <Table.Cell>{workout.class_description}</Table.Cell>
                            <Table.Cell>
                            <Flex align="center" gap="2">
                                    <Tooltip content="Edit">
                                        <FiEdit style={{ cursor: 'pointer' }}  onClick={() => handleEditClick(workout.name)} />
                                    </Tooltip>
                                    
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}