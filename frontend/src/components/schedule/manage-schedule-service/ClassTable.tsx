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
        console.log("Navigating to workout:", workout);
        navigate(`/channel/service-schedule/${encodeURIComponent(workout.class_id)}`, { state: { workout } });
    };
    
    
      
    return (
     <>
      

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
                    const isSelected = selected.includes(workout.service_id) || defaultSelected.includes(workout.service_id)
                    return (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell><Checkbox checked={isSelected} disabled={defaultSelected.includes(workout.service_id)} onCheckedChange={() => onCheckboxChange(workout.service_id)} /></Table.RowHeaderCell>
                            <Table.Cell style={{ cursor: 'pointer' }} onClick={() => handleViewClick(workout)}>
                               {workout.service_id}
                            </Table.Cell>

                            <Table.Cell>{workout.title}</Table.Cell>
                            <Table.Cell>{workout.start_time}</Table.Cell>
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