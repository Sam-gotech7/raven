import { useDebounce } from "@/hooks/useDebounce"
import { usePaginationWithDoctype } from "@/hooks/usePagination"
import { User } from "@/types/Core/User"
import { Filter, useFrappeGetDocList, useFrappePostCall, useSWRConfig ,useFrappeAuth} from "frappe-react-sdk"
import { ChangeEvent, useContext, useState } from "react"
import { ErrorBanner } from "@/components/layout/AlertBanner"
import { TableLoader } from "@/components/layout/Loaders/TableLoader"
import { UserListContext } from "@/utils/users/UserListProvider"
import { Button, Flex, Strong, Text, TextField } from "@radix-ui/themes"
import { Loader } from "@/components/common/Loader"
import { BiSearch } from "react-icons/bi"
import { ErrorCallout } from "@/components/common/Callouts/ErrorCallouts"
import { toast } from "sonner"
import { Sort } from "../../feature/sorting"
import { PageLengthSelector } from "../../feature/pagination/PageLengthSelector"
import { PageSelector } from "../../feature/pagination/PageSelector"
import { UsersTable } from "./ClassTable"
import { isSystemManager } from "@/utils/roles"
import { useNavigate } from "react-router-dom";
interface AddUsersResponse {
    failed_users: User[],
    success_users: User[]
}

const AddUsers = () => {

    const { mutate } = useSWRConfig()
    const { currentUser } = useFrappeAuth()

    const [searchText, setSearchText] = useState("")
    const debouncedText = useDebounce(searchText, 200)
    const navigate = useNavigate(); 
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
    }

    const filters: Filter[] = [['class_title', 'like', `%${debouncedText}%`],['owner', '=', `${currentUser}`]]
    const { start, count, selectedPageLength, setPageLength, nextPage, previousPage } = usePaginationWithDoctype("Classes", 10,filters)
    const [sortOrder, setSortOder] = useState<"asc" | "desc">("desc")
   

    const { data, error } = useFrappeGetDocList("Classes", {
        fields: ['class_title','class_description','creation', 'name','owner'],
        filters,
        orderBy: {
            field: 'creation',
            order: sortOrder
        },
        limit_start: start > 0 ? (start - 1) : 0,
        limit: selectedPageLength
    })

    console.log(data)
    console.log(error)
    const users = useContext(UserListContext)
    const ravenUsersArray = users.enabledUsers.map(user => user.name)

    const [selected, setSelected] = useState<string[]>([])
    const [failedUsers, setFailedUsers] = useState<User[]>([])

 

    return (
        <Flex direction='column' gap='4' px='6' py='4'>

            <Flex justify='between' align='center'>
                <Flex direction='column' gap='0'>
                    <Text size='3' className={'font-semibold'}>Manage Class</Text>
                    <Text size='1' color='gray'></Text>
                </Flex>
                <Button type='button' className="cursor-pointer" onClick={()=>{navigate("/channel/class/create");}}>
                    
                   Add
                </Button>
            </Flex>

            <Flex direction='column' gap='4'>
                <Flex wrap='wrap' justify='between' gap='2'>
                    <Flex gap='2' align='center'>
                        <TextField.Root onChange={handleChange}
            className='375:w-[19rem] 400:w-[20rem] 425:w-[22rem] 450:w-[24rem] w-[22rem]'
            type='text'
                            placeholder='Search for Class'>
                            <TextField.Slot side='left'>
                                <BiSearch />
                            </TextField.Slot>
                        </TextField.Root>
                        {debouncedText.length > 0 && debouncedText.length < 2 && <Text size='1' color="gray">Continue typing...</Text>}
                    </Flex>
                    <Flex justify='end' gap='2' align='center'>
                        <Sort
                            sortOrder={sortOrder}
                            onSortOrderChange={(order) => setSortOder(order)} />
                        <PageLengthSelector
                            options={[2,10, 20, 50, 100]}
                            selectedValue={selectedPageLength}
                            updateValue={(value) => setPageLength(value)} />
                        <PageSelector
                            rowsPerPage={selectedPageLength}
                            start={start}
                            totalRows={count!}
                            gotoNextPage={() => nextPage()}
                            gotoPreviousPage={() => previousPage()} />
                    </Flex>
                </Flex>

                <ErrorBanner error={error} />
               
                {!data && !error && <TableLoader columns={3} />}

                {data && data.length === 0 && debouncedText.length >= 2 &&
                    <Flex align='center' justify='center' className="min-h-[32rem]">
                        <Text size='2' align='center'>No results found</Text>
                    </Flex>}

                {data && data.length !== 0 && <UsersTable data={data} defaultSelected={ravenUsersArray} selected={selected} setSelected={setSelected} />}

            </Flex>
        </Flex>
    )
}

export const Component = AddUsers