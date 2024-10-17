import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Label, ErrorText, HelperText } from "@/components/common/Form";
import { Label as RadixLabel } from "@radix-ui/react-label";
import { Stack, HStack } from "@/components/layout/Stack";
import { useIsDesktop, useIsMobile } from "@/hooks/useMediaQuery";
import { PageHeader } from "../layout/Heading/PageHeader";
import { Heading, TextField, TextArea, Box } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { BiChevronLeft } from "react-icons/bi";
import { useTheme } from "../../ThemeProvider";
import {
  FrappeConfig,
  FrappeContext,
  useFrappeAuth,
  useFrappeGetDoc,
} from "frappe-react-sdk";
import Select from "react-select";
import { toast } from "sonner";

const CreateClass = () => {
  const { appearance } = useTheme();
  const { call, db } = useContext(FrappeContext) as FrappeConfig;
  const { currentUser } = useFrappeAuth();
  const isMobile = useIsMobile();
  const [classForm, setClassForm] = useState({
    title: "",
    workouts: [],
    location: "",
    type: "",
    description: "",
    category: "Workout",
    prerequisites: "",
    equipments: "",
    status: "Active",
    visibilityStatus: "Private",
    requiredCapacity: false,
    equipmentsprerequisites: [],
    minimumCapacity: "",
    maximumCapacity: "",
    tagItem: "",
    isPaid: false,
    rate: "",
    feeDescription: "",
    duration: "",
  });
  const [selectedTagdataDetails, setSelectedTagdataDetails] = useState(0);

  const {
    data: tagData,
    error,
    mutate,
  } = useFrappeGetDoc("Item", classForm.tagItem);

  useEffect(() => {
    if (classForm.tagItem && tagData?.standard_rate > 0) {
      setSelectedTagdataDetails(tagData.standard_rate);
      setClassForm((prev) => ({
        ...prev,
        rate: String(tagData.standard_rate),
      }));
    }
  }, [classForm.tagItem, tagData]);

  const categoryOptions = [
    { value: "Workout", label: "Workout" },
    { value: "Class", label: "Class" },
    { value: "Service", label: "Service" },
  ];
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Deactive", label: "Deactive" },
  ];
  
  const visibilityStatusOptions = [
    { value: "Private", label: "Private" },
    { value: "Public", label: "Public" },
  ];
  const [locationOptions, setLocationOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [workoutOptions, setWorkoutOptions] = useState([]);
  const [gymEquipmentOptions, setGymEquipment] = useState([]);
  const [tagptions, setTagOptions] = useState([]);

  const fetchTagsOptions = (inputValue: any) => {
    let categorytype = classForm?.category == "Class" ? "Classes" : "Services";
    console.log(categorytype);
    if (inputValue.length > 0) {
      const searchParams = {
        doctype: "Item",
        txt: inputValue,
        filters: { item_group: categorytype },
      };
      call
        .get("frappe.desk.search.search_link", searchParams)
        .then((result) => {
          if (result && result.message) {
            const options = result.message.map((location: any) => ({
              label: location.value,
              value: location.value,
            }));
            setTagOptions(options);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const fetchLocationOptions = (inputValue: string) => {
    if (inputValue.length > 0) {
      const searchParams = {
        doctype: "Go Location",
        txt: inputValue,
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
    }
  };

  const fetchGymEquipmentOptions = (inputValue: string) => {
    if (inputValue.length > 0) {
      const searchParams = {
        doctype: "Gym Equipment",
        txt: inputValue,
      };
      call
        .get("frappe.desk.search.search_link", searchParams)
        .then((result) => {
          if (result && result.message) {
            const options = result.message.map((location: any) => ({
              label: location.value,
              value: location.value,
            }));
            setGymEquipment(options);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const fetchClassOptions = (inputValue: string) => {
    if (inputValue.length > 0) {
      const searchParams = {
        doctype: "Class Type Master",
        txt: inputValue,
      };
      call
        .get("frappe.desk.search.search_link", searchParams)
        .then((result) => {
          if (result && result.message) {
            const options = result.message.map((type: any) => ({
              label: type.value,
              value: type.value,
            }));
            setClassOptions(options);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const fetchWorkoutOptions = (inputValue: string) => {
    if (inputValue.length > 0) {
      const searchParams = {
        doctype: "Workout Master",
        txt: inputValue,
      };
      call
        .get("frappe.desk.search.search_link", searchParams)
        .then((result) => {
          if (result && result.message) {
            const options = result.message.map((type: any) => ({
              label: type.value,
              value: type.value,
            }));
            setWorkoutOptions(options);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setClassForm((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleLocationChange = (selectedOption: any) => {
    setClassForm((prev) => ({
      ...prev,
      location: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleTagChange = (selectedOption: any) => {
    setClassForm((prev) => ({
      ...prev,
      tagItem: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleEquipmentChange = (selectedOptions: any) => {
    const equipmentsprerequisites = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setClassForm((prev) => ({ ...prev, equipmentsprerequisites }));
  };

  const handleTypeChange = (selectedOption: any) => {
    setClassForm((prev) => ({
      ...prev,
      type: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleWorkoutChange = (selectedOptions: any) => {
    const workouts = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setClassForm((prev) => ({ ...prev, workouts }));
  };

  const generateRandomString = (length = 10) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (classForm?.category == "Workout") {
      const workoutGroups = classForm.workouts?.map((workout: string) => ({
        doctype: "Workout Group",
        workout: workout,
      }));
      const equipmentGroups = classForm.equipmentsprerequisites?.map(
        (equipment: string) => ({
          doctype: "Equipment Group",
          equipment_name: equipment,
        })
      );
      const randomName = `new-classes-${generateRandomString()}`;

      db.createDoc("Classes", {
        docstatus: 0,
        doctype: "Classes",
        name: randomName,
        owner: currentUser,
        type: "Workout",
        workouts: workoutGroups,
        req_capacity: classForm?.requiredCapacity == true ? 1 : 0,
        equipments_pre: equipmentGroups,
        is_paid: classForm.isPaid ? 1 : 0,
        status: classForm?.status,
        visibility_status: classForm?.visibilityStatus,
        class_title: classForm?.title,
        location: classForm?.location,
        class_description: classForm?.description,
        class_type: classForm?.type,
        prequisites: classForm?.prerequisites,
        minimum_capacity: classForm?.minimumCapacity || 0,
        maximum_capacity: classForm?.maximumCapacity || 0,
      })
        .then((doc) => {
          toast.success("Class Add successfully");
          setClassForm({
            title: "",
            workouts: [],
            location: "",
            type: "",
            description: "",
            category: "Workout",
            prerequisites: "",
            equipments: "",
            status: "Active",
            visibilityStatus: "Private",
            requiredCapacity: false,
            equipmentsprerequisites: [],
            minimumCapacity: "",
            maximumCapacity: "",
            tagItem: "",
            isPaid: false,
            rate: "",
            feeDescription: "",
            duration: "",
          });
        })
        .catch((error) => console.error(error));
    }

    if (classForm?.category == "Service") {
      const equipmentGroups = classForm.equipmentsprerequisites?.map(
        (equipment: string) => ({
          doctype: "Equipment Group",
          equipment_name: equipment,
        })
      );
      const randomName = `new-classes-${generateRandomString()}`;
      db.createDoc("Classes", {
        docstatus: 0,
        doctype: "Classes",
        name: randomName,
        owner: currentUser,
        type: "Service",
        workouts: [],
        req_capacity: classForm?.requiredCapacity == true ? 1 : 0,
        equipments_pre: equipmentGroups,
        is_paid: classForm.isPaid ? 1 : 0,
        status: classForm?.status,
        visibility_status: classForm?.visibilityStatus,
        tag_item: classForm?.tagItem,
        class_title: classForm?.title,
        location: classForm?.location,
        class_description: classForm?.description,
        class_type: classForm?.type,
        duration: classForm?.duration,
        prequisites: classForm?.prerequisites,
        class_fee: classForm?.rate,
        fee_description: classForm?.feeDescription,
      })
        .then((doc) => {
          toast.success("Class Add successfully");
          setClassForm({
            title: "",
            workouts: [],
            location: "",
            type: "",
            description: "",
            category: "Workout",
            prerequisites: "",
            equipments: "",
            status: "Active",
            visibilityStatus: "Private",
            requiredCapacity: false,
            equipmentsprerequisites: [],
            minimumCapacity: "",
            maximumCapacity: "",
            tagItem: "",
            isPaid: false,
            rate: "",
            feeDescription: "",
            duration: "",
          });
        })
        .catch((error) => console.error(error));
    }

    if (classForm?.category == "Class") {
      const workoutGroups = classForm.workouts?.map((workout: string) => ({
        doctype: "Workout Group",
        workout: workout,
      }));
      const equipmentGroups = classForm.equipmentsprerequisites?.map(
        (equipment: string) => ({
          doctype: "Equipment Group",
          equipment_name: equipment,
        })
      );
      const randomName = `new-classes-${generateRandomString()}`;

      db.createDoc("Classes", {
        docstatus: 0,
        doctype: "Classes",
        name: randomName,
        owner: currentUser,
        type: "Class",
        workouts: workoutGroups,
        req_capacity: classForm?.requiredCapacity == true ? 1 : 0,
        equipments_pre: equipmentGroups,
        is_paid: classForm.isPaid ? 1 : 0,
        status: classForm.status,
        visibility_status: classForm.visibilityStatus,
        class_title: classForm.title,
        location: classForm.location,
        minimum_capacity: classForm.minimumCapacity,
        maximum_capacity: classForm.maximumCapacity,
        tag_item: classForm.tagItem,
        class_description: classForm.description,
        class_type: classForm.type,
        prequisites: classForm.prerequisites,
        class_fee: classForm.rate,
        fee_description: classForm.feeDescription,
      })
        .then((doc) => {
          toast.success("Class Add successfully");
          setClassForm({
            title: "",
            workouts: [],
            location: "",
            type: "",
            description: "",
            category: "Workout",
            prerequisites: "",
            equipments: "",
            status: "Active",
            visibilityStatus: "Private",
            requiredCapacity: false,
            equipmentsprerequisites: [],
            minimumCapacity: "",
            maximumCapacity: "",
            tagItem: "",
            isPaid: false,
            rate: "",
            feeDescription: "",
            duration: "",
          });
        })
        .catch((error) => console.error(error));
    }
  };

  const renderConditionalFields = () => {
    if (classForm.category === "Class") {
      return (
        <>
          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label htmlFor="minimumCapacity"> Minimum Capacity</Label>
              <TextField.Root
                type="number"
                name="minimumCapacity"
                value={classForm.minimumCapacity}
                onChange={handleInputChange}
                placeholder="Minimum Capacity"
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <Label htmlFor="maximumCapacity"> Maximum Capacity</Label>
              <TextField.Root
                type="number"
                name="maximumCapacity"
                value={classForm.maximumCapacity}
                onChange={handleInputChange}
                placeholder="Maximum Capacity"
              />
            </Box>
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label> Tag Item</Label>

              <Select
                options={tagptions}
                onInputChange={fetchTagsOptions}
                onChange={handleTagChange}
                placeholder="Search Item"
                className="basic-single"
                classNamePrefix="select"
                isClearable
                name="tagItem"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor: state.isFocused ? "#007BFF" : "#444",
                    boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#007BFF" : "#666",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    color: appearance === "dark" ? "#fff" : "#000",
                  }),
                  option: (baseStyles, { isFocused }) => ({
                    ...baseStyles,
                    backgroundColor: isFocused
                      ? appearance === "dark"
                        ? "#555"
                        : "#eee"
                      : "transparent",
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

            <Box style={{ flex: 1 }}>
              <Label> Is Paid</Label>
              <input
                type="checkbox"
                name="isPaid"
                checked={classForm.isPaid}
                onChange={handleInputChange}
              />
            </Box>
          </Stack>

          {classForm.isPaid && (
            <Stack
              direction={isMobile ? "column" : "row"}
              gap="4"
              style={{ width: "100%" }}
            >
              <Box style={{ flex: 1 }}>
                <Label> Rate</Label>
                <TextField.Root
                  type="number"
                  name="rate"
                  value={classForm.rate}
                  onChange={handleInputChange}
                  placeholder="Rate"
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Label> Fee Description</Label>

                <TextField.Root
                  type="text"
                  name="feeDescription"
                  value={classForm.feeDescription}
                  onChange={handleInputChange}
                  placeholder="Fee Description"
                />
              </Box>
            </Stack>
          )}
        </>
      );
    }

    if (classForm.category === "Service") {
      return (
        <>
          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label> Tag Item</Label>

              <Select
                options={tagptions}
                onInputChange={fetchTagsOptions}
                onChange={handleTagChange}
                placeholder="Search Item"
                className="basic-single"
                classNamePrefix="select"
                isClearable
                name="tagItem"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor: state.isFocused ? "#007BFF" : "#444",
                    boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#007BFF" : "#666",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    color: appearance === "dark" ? "#fff" : "#000",
                  }),
                  option: (baseStyles, { isFocused }) => ({
                    ...baseStyles,
                    backgroundColor: isFocused
                      ? appearance === "dark"
                        ? "#555"
                        : "#eee"
                      : "transparent",
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
            <Box style={{ flex: 1 }}>
              <Label> Duration (mins)</Label>

              <TextField.Root
                type="number"
                name="duration"
                value={classForm.duration}
                onChange={handleInputChange}
                placeholder="Duration (mins)"
              />
            </Box>
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label> Is Paid</Label>
              <input
                type="checkbox"
                name="isPaid"
                checked={classForm.isPaid}
                onChange={handleInputChange}
              />
            </Box>
          </Stack>

          {classForm.isPaid && (
            <Stack
              direction={isMobile ? "column" : "row"}
              gap="4"
              style={{ width: "100%" }}
            >
              <Box style={{ flex: 1 }}>
                <Label> Rate</Label>
                <TextField.Root
                  type="number"
                  name="rate"
                  value={classForm.rate}
                  onChange={handleInputChange}
                  placeholder="Rate"
                  disabled={selectedTagdataDetails > 0}
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Label> Fee Description</Label>

                <TextField.Root
                  type="text"
                  name="feeDescription"
                  value={classForm.feeDescription}
                  onChange={handleInputChange}
                  placeholder="Fee Description"
                />
              </Box>
            </Stack>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <>
      <PageHeader>
        <Flex align="center" gap="3" className="h-8">
          <Link
            to="/channel"
            className="block bg-transparent hover:bg-transparent active:bg-transparent sm:hidden"
          >
            <BiChevronLeft size="24" className="block text-gray-12" />
          </Link>
          <Heading size="5">Create Class</Heading>
        </Flex>
      </PageHeader>

      <div className="mx-10 my-20">
        <form onSubmit={SubmitHandler} className="space-y-6">
          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label> Title</Label>
              <TextField.Root
                type="text"
                name="title"
                value={classForm.title}
                onChange={handleInputChange}
                placeholder="Class Title"
              />
            </Box>
            {classForm.category !== "Service" && (
              <Box style={{ flex: 1 }}>
                <Label> Workouts</Label>

                <Select
                  options={workoutOptions}
                  onInputChange={fetchWorkoutOptions}
                  onChange={handleWorkoutChange}
                  placeholder="Search Workouts"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable
                  isMulti
                  name="workouts"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor:
                        appearance === "dark" ? "#17191A" : "#fff",
                      borderColor: state.isFocused ? "#007BFF" : "#444",
                      boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                      "&:hover": {
                        borderColor: state.isFocused ? "#007BFF" : "#666",
                      },
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor:
                        appearance === "dark" ? "#17191A" : "#fff",
                      color: appearance === "dark" ? "#fff" : "#000",
                    }),
                    option: (baseStyles, { isFocused }) => ({
                      ...baseStyles,
                      backgroundColor: isFocused
                        ? appearance === "dark"
                          ? "#555"
                          : "#eee"
                        : "transparent",
                      color: appearance === "dark" ? "#fff" : "#000",
                    }),
                    multiValue: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: appearance === "dark" ? "#444" : "#ddd",
                      color: appearance === "dark" ? "#fff" : "#000",
                    }),
                    multiValueLabel: (baseStyles) => ({
                      ...baseStyles,
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
            )}
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label> Location</Label>

              <Select
                options={locationOptions}
                onInputChange={fetchLocationOptions}
                onChange={handleLocationChange}
                placeholder="Search Location"
                className="basic-single"
                classNamePrefix="select"
                isClearable
                name="location"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor: state.isFocused ? "#007BFF" : "#444",
                    boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#007BFF" : "#666",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    color: appearance === "dark" ? "#fff" : "#000",
                  }),
                  option: (baseStyles, { isFocused }) => ({
                    ...baseStyles,
                    backgroundColor: isFocused
                      ? appearance === "dark"
                        ? "#555"
                        : "#eee"
                      : "transparent",
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

            <Box style={{ flex: 1 }}>
              <Label> Type</Label>
              <Select
                options={classOptions}
                onInputChange={fetchClassOptions}
                onChange={handleTypeChange}
                placeholder="Search Class Type"
                className="basic-single"
                classNamePrefix="select"
                isClearable
                name="type"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor: state.isFocused ? "#007BFF" : "#444",
                    boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#007BFF" : "#666",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    color: appearance === "dark" ? "#fff" : "#000",
                  }),
                  option: (baseStyles, { isFocused }) => ({
                    ...baseStyles,
                    backgroundColor: isFocused
                      ? appearance === "dark"
                        ? "#555"
                        : "#eee"
                      : "transparent",
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
          </Stack>

          <Box>
            <Label htmlFor="description" isRequired>
              Description
            </Label>
            <TextArea
              name="description"
              value={classForm.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={5}
            />
          </Box>

          <Box>
            <Label>Equipments Prerequisites</Label>
            <Select
              options={gymEquipmentOptions}
              onInputChange={fetchGymEquipmentOptions}
              onChange={handleEquipmentChange}
              placeholder="Search Equipments"
              className="basic-multi-select"
              classNamePrefix="select"
              isClearable
              isMulti
              name="equipmentsprerequisites"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                  borderColor: state.isFocused ? "#007BFF" : "#444",
                  boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
                  "&:hover": {
                    borderColor: state.isFocused ? "#007BFF" : "#666",
                  },
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                  color: appearance === "dark" ? "#fff" : "#000",
                }),
                option: (baseStyles, { isFocused }) => ({
                  ...baseStyles,
                  backgroundColor: isFocused
                    ? appearance === "dark"
                      ? "#555"
                      : "#eee"
                    : "transparent",
                  color: appearance === "dark" ? "#fff" : "#000",
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: appearance === "dark" ? "#444" : "#ddd",
                  color: appearance === "dark" ? "#fff" : "#000",
                }),
                multiValueLabel: (baseStyles) => ({
                  ...baseStyles,
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

          <Stack
      direction={isMobile ? "column" : "row"}
      gap="4"
      style={{ width: "100%" }}
    >
      {/* Category Select */}
      <Box style={{ width: "100%" }}>
        <RadixLabel htmlFor="category">Category</RadixLabel>
        <Select
          id="category"
          options={categoryOptions}
          value={categoryOptions.find(
            (option) => option.value === classForm.category
          )}
          onChange={(option) => handleInputChange({ target: { name: "category", value: option?.value } })}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
              borderColor: state.isFocused ? "#007BFF" : "#444",
              boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
              "&:hover": {
                borderColor: state.isFocused ? "#007BFF" : "#666",
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
              color: appearance === "dark" ? "#fff" : "#000",
            }),
            option: (baseStyles, { isFocused }) => ({
              ...baseStyles,
              backgroundColor: isFocused
                ? appearance === "dark"
                  ? "#555"
                  : "#eee"
                : "transparent",
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

      {/* Prerequisites Input */}
      <Box style={{ width: "100%" }}>
        <RadixLabel>Prerequisites</RadixLabel>
        <TextField.Root
          type="text"
          name="prerequisites"
          value={classForm.prerequisites}
          onChange={handleInputChange}
          placeholder="Prerequisites"
        />
      </Box>
    </Stack>

    <Stack
      direction={isMobile ? "column" : "row"}
      gap="4"
      style={{ width: "100%" }}
    >
      {/* Status Select */}
      <Box style={{ flex: 1 }}>
      <Label htmlFor="status" isRequired>Status</Label>
      
        <Select
          name="status"
          options={statusOptions}
          value={statusOptions.find(
            (option) => option.value === classForm.status
          )}
          onChange={(option) =>
            handleInputChange({ target: { name: "status", value: option?.value } })
          }
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
              borderColor: state.isFocused ? "#007BFF" : "#444",
              boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
              "&:hover": {
                borderColor: state.isFocused ? "#007BFF" : "#666",
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
              color: appearance === "dark" ? "#fff" : "#000",
            }),
            option: (baseStyles, { isFocused }) => ({
              ...baseStyles,
              backgroundColor: isFocused
                ? appearance === "dark"
                  ? "#555"
                  : "#eee"
                : "transparent",
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

      {/* Visibility Status Select */}
      <Box style={{ flex: 1 }}>
      <Label htmlFor="status" isRequired>Visibility Status</Label>        
        <Select
          name="visibilityStatus"
          options={visibilityStatusOptions}
          value={visibilityStatusOptions.find(
            (option) => option.value === classForm.visibilityStatus
          )}
          onChange={(option) =>
            handleInputChange({ target: { name: "visibilityStatus", value: option?.value } })
          }
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
              borderColor: state.isFocused ? "#007BFF" : "#444",
              boxShadow: state.isFocused ? "0 0 0 1px #007BFF" : "none",
              "&:hover": {
                borderColor: state.isFocused ? "#007BFF" : "#666",
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
              color: appearance === "dark" ? "#fff" : "#000",
            }),
            option: (baseStyles, { isFocused }) => ({
              ...baseStyles,
              backgroundColor: isFocused
                ? appearance === "dark"
                  ? "#555"
                  : "#eee"
                : "transparent",
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
    </Stack>

          {classForm.category !== "Workout" && renderConditionalFields()}

          {classForm.category === "Workout" && (
            <>
             <Stack
      direction={isMobile ? "column" : "row"}
      gap="4"
      style={{ width: "100%" }}
    >
         <Box style={{ flex: 1 }}>
         <Label htmlFor="requiredCapacity" isRequired> Required Capacity
         </Label>
             
                  <input
                    type="checkbox"
                    name="requiredCapacity"
                    checked={classForm.requiredCapacity}
                    onChange={handleInputChange}
                  />
                </Box>
</Stack>
              {classForm.requiredCapacity && (
      <Stack
      direction={isMobile ? "column" : "row"}
      gap="4"
      style={{ width: "100%" }}

    >               
    <Box style={{ flex: 1 }}>
    <Label htmlFor="minimumCapacity">Minimum Capacity</Label>
      
                    
                    <TextField.Root
                      type="number"
                      name="minimumCapacity"
                      value={classForm.minimumCapacity}
                      onChange={handleInputChange}
                      placeholder="Minimum Capacity"
                    />
    </Box>
    <Box style={{ flex: 1 }}>
    <Label htmlFor="maximumCapacity">Maximum Capacity</Label>
                    
                    <TextField.Root
                      type="number"
                      name="maximumCapacity"
                      value={classForm.maximumCapacity}
                      onChange={handleInputChange}
                      placeholder="Maximum Capacity"
                    />
                  </Box>
                </Stack>
              )}
            </>
          )}

          <button
            type="submit"
            className="px-7 cursor-pointer hover:scale-105 text-lg font-semibold py-2 bg-transparent border rounded-lg border-blue-900"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export const Component = CreateClass;
