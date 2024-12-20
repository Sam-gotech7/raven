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


      
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell><Checkbox checked={isAllChecked} onCheckedChange={(e) => setAllChecked(e.valueOf() ? true : false)} /></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Customer Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

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

                            <Table.Cell>{workout.customer_name}</Table.Cell>
                            <Table.Cell>{workout.status}</Table.Cell>
                            <Table.Cell>
                            {workout?.custom_start_time?.split(' ')[0]}
                            </Table.Cell>
                            <Table.Cell>
                            {`${workout?.custom_start_time?.split(' ')[1]} to ${workout?.custom_end_time?.split(' ')[1]}`}
                            </Table.Cell>
                            <Table.Cell>{workout.customer_email}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}