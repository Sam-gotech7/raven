import { User } from "@/types/Core/User"
import { useMemo } from "react"
import { Badge, Box, Checkbox, Flex, Table, Tooltip } from "@radix-ui/themes"
import { UserAvatar } from "@/components/common/UserAvatar"
import { StandardDate } from "@/utils/dateConversions"
import { FiAlertTriangle } from "react-icons/fi"

interface UsersTableProps {
    data: User[],
    defaultSelected: string[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export const UsersTable = ({ data, selected, setSelected, defaultSelected }: UsersTableProps) => {

    const setAllChecked = (checked: boolean) => {
        if (checked) {
            setSelected((curr) => {
                const user_array: string[] = []
                data.forEach(user => {
                    if (!selected.includes(user.name) && !defaultSelected.includes(user.name)) {
                        user_array.push(user.name)
                    }
                })
                return [...curr, ...user_array]
            })
        } else {
            setSelected([])
        }
    }

    const isAllChecked = useMemo(() => {
        if (data && data.length) {
            let allChecked = true
            data?.forEach(user => {
                if (!selected.includes(user.name) && !defaultSelected.includes(user.name)) {
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
                return curr.filter((user) => user !== v)
            } else {
                return [...curr, v]
            }
        })
    }

    return (
        <Table.Root variant="surface" className='rounded-sm'>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell><Checkbox checked={isAllChecked} onCheckedChange={(e) => setAllChecked(e.valueOf() ? true : false)} /></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>User ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>transaction on</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data?.map((user: any, index) => {
                    const isSelected = selected.includes(user.member_id) || defaultSelected.includes(user.member_id)
                    return (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell><Checkbox checked={isSelected} disabled={defaultSelected.includes(user.member_id)} onCheckedChange={() => onCheckboxChange(user.member_id)} /></Table.RowHeaderCell>
                            <Table.Cell>
                                <Flex gap='2' align='center'>
                                    <UserAvatar src={user.image} alt={user.member_name} />
                                    {user.member_id ?? '-'}
                                </Flex>
                            </Table.Cell>

                            <Table.Cell>{user.member_name}</Table.Cell>
                            <Table.Cell>{user.mobile}</Table.Cell>
                            <Table.Cell><StandardDate date={user.transaction_on} /></Table.Cell>
                            <Table.Cell>{user.email_id}</Table.Cell>
                            <Table.Cell>{user.location}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}