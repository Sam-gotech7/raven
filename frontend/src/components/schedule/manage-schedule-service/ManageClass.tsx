import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationWithDoctype } from "@/hooks/usePagination";
import { User } from "@/types/Core/User";
import { Select } from "@radix-ui/themes";
import DatePicker from "react-datepicker"; // Import a date picker library
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
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
import { ChangeEvent, useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import { ErrorBanner } from "@/components/layout/AlertBanner";
import { TableLoader } from "@/components/layout/Loaders/TableLoader";
import { UserListContext } from "@/utils/users/UserListProvider";
import { Button, Flex, Strong, Text, TextField } from "@radix-ui/themes";
import { Loader } from "@/components/common/Loader";
import { BiSearch } from "react-icons/bi";
import { ErrorCallout } from "@/components/common/Callouts/ErrorCallouts";
import { toast } from "sonner";
import { Sort } from "../../feature/sorting";
import { PageLengthSelector } from "../../feature/pagination/PageLengthSelector";
import { PageSelector } from "../../feature/pagination/PageSelector";
import { UsersTable } from "./ClassTable";
import { isSystemManager } from "@/utils/roles";
import { useNavigate } from "react-router-dom";
interface AddUsersResponse {
  failed_users: User[];
  success_users: User[];
}

const AddUsers = () => {
  const { mutate } = useSWRConfig();
  const { currentUser } = useFrappeAuth();
  const { call, db } = useContext(FrappeContext) as FrappeConfig;
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState("null");
  const [location, setLocation] = useState("null");
  const [limit,setLimit] = useState(20)
  const debouncedText = useDebounce(searchText, 200);
  const navigate = useNavigate();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  console.log(selectedDate)
  const [instructorId, setInstructorId] = useState("");

  const handleChangeStatus = (value: string) => {
    setStatus(value);
  };

  const handleChangeLocation = (value: string) => {
    setLocation(value);
  };
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
      console.log(currentUser, "ghsBSCJHsDJHGdSHdSkh");
      fetchInstructorId();
      fetchLocationOptions();
    }
  }, [currentUser]);

  const filters: Filter[] = [
    ["class_title", "like", `%${debouncedText}%`],
    ["owner", "=", `${currentUser}`],
  ];
  const {
    start,
    count,
    selectedPageLength,
    setPageLength,
    nextPage,
    previousPage,
  } = usePaginationWithDoctype("Classes", 10, filters);
  const [sortOrder, setSortOder] = useState<"asc" | "desc">("desc");
  const users = useContext(UserListContext);
  const ravenUsersArray = users.enabledUsers.map((user) => user.name);
  const [selected, setSelected] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  console.log(`go_gym.api.routes.base.instructor_api?action=get_services&limit=${limit}&instructor_id=${instructorId}&&filters={"date":"${formattedDate}","status":"${status == 'null' ? '' : status}","location":"${location == 'null' ? '' : location}","search":"${searchText.length > 2 ? '' : searchText}"}`)
  const { data, isLoading, error } = useFrappeGetCall<any>(
    `go_gym.api.routes.base.instructor_api?action=get_services&limit=${limit}&instructor_id=${instructorId}&&filters={"date":"${formattedDate}","status":"${status == 'null' ? '' : status}","location":"${location == 'null' ? '' : location}","search":"${searchText.length > 2 ? '' : searchText}"}`,
    {}
  );

  console.log(data)

  const fetchLocationOptions = () => {
      const searchParams = {
        doctype: "Go Location",
        txt: '',
      };
      call
        .get("frappe.desk.search.search_link", searchParams)
        .then((result) => {
          if (result && result.message) {
            const options = result.message.map((location: any) => ({
              label: location.value,
              value: location.value,
            }));
            
            setLocationOptions(options);
          }
        })
        .catch((error) => console.error(error));
  };
  console.log(data?.message?.data);
  console.log(locationOptions);
const options = [20, 50, 100, 200, 500]
  const handleLimitChange = (value: string) => {
    let numValue = parseInt(value)
    setLimit(numValue)
}
  return (
    <Flex direction="column" gap="4" px="6" py="4">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="0">
          <Text size="3" className={"font-semibold"}>
            Service Schedules
          </Text>
          <Text size="1" color="gray"></Text>
        </Flex>
        {/* <Button
          type="button"
          className="cursor-pointer"
          onClick={() => {
            navigate("/channel/class/create");
          }}
        >
          Add
        </Button> */}
      </Flex>

      <Flex direction="column" gap="4">
        <Flex wrap="wrap" justify="between" gap="2">
          <Flex gap="2" align="center">
            <TextField.Root
              onChange={handleChange}
              className="375:w-[19rem] 400:w-[20rem] 425:w-[22rem] 450:w-[24rem] w-[22rem]"
              type="text"
              placeholder="Search for Schedule"
            >
              <TextField.Slot side="left">
                <BiSearch />
              </TextField.Slot>
            </TextField.Root>
            {debouncedText.length > 0 && debouncedText.length < 2 && (
              <Text size="1" color="gray">
                Continue typing...
              </Text>
            )}
          </Flex>

         

          <Flex gap="2" align="center">
       
            <Select.Root size="1" onValueChange={handleChangeStatus} value={status}>
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content className="z-50">
                <Select.Item value="null">Select Status</Select.Item>
                <Select.Item value="Scheduled">Scheduled</Select.Item>
                <Select.Item value="Not Scheduled">Not Scheduled</Select.Item>
              </Select.Content>
            </Select.Root>
            <Select.Root size="1" onValueChange={handleChangeLocation} value={location}>
              <Select.Trigger variant="soft" color="gray" />
              <Select.Content className="z-50">
                <Select.Item value="null">Select Location</Select.Item>
                {
                  locationOptions?.map((loc:any)=>
                    <Select.Item value={loc.value}>{loc.label}</Select.Item>

                  )
                }
              </Select.Content>
            </Select.Root>
            <div className="custom-datepicker-container">
    <DatePicker
      selected={selectedDate}
      onChange={(date:any) => setSelectedDate(date)}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select Date"
      className="custom-datepicker-input"
    />
  </div>
          </Flex>

          <Flex justify="end" gap="2" align="center">
            <Sort
              sortOrder={sortOrder}
              onSortOrderChange={(order) => setSortOder(order)}
            />
             <Select.Root size='1' onValueChange={handleLimitChange} value={limit.toString()}>
            <Select.Trigger variant="soft" color="gray" />
            <Select.Content className="z-50">
                {options?.map((option) => (
                    <Select.Item key={option} value={option.toString()}>{option} rows</Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
            <PageSelector
              rowsPerPage={selectedPageLength}
              start={start}
              totalRows={count!}
              gotoNextPage={() => nextPage()}
              gotoPreviousPage={() => previousPage()}
            />
          </Flex>
        </Flex>

        <ErrorBanner error={error} />

        {!data && !error && <TableLoader columns={3} />}

        {data?.message?.data &&
          data?.message?.data.length === 0 && (
            <Flex align="center" justify="center" className="min-h-[32rem]">
              <Text size="2" align="center">
                No results found
              </Text>
            </Flex>
          )}

        {data?.message?.data && data?.message?.data?.length !== 0 && !isLoading && (
          <UsersTable
            data={data?.message?.data}
            defaultSelected={ravenUsersArray}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </Flex>
    </Flex>
  );
};

export const Component = AddUsers;
