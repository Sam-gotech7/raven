import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; 
import { FrappeConfig, FrappeContext,useFrappeAuth,useFrappeGetDoc } from "frappe-react-sdk";
import Select from 'react-select'; 

const CreateClass = () => {
    const { appearance } = useTheme(); 
    const { call,db } = useContext(FrappeContext) as FrappeConfig;
    const { currentUser } = useFrappeAuth()
    const [classForm, setClassForm] = useState({
        title: '',
        workouts: [],
        location: '',
        type: '',
        description: '',
        category: 'Workout', 
        prerequisites: '',
        equipments: '',
        status: 'Active',
        visibilityStatus: 'Private', 
        requiredCapacity: false, 
        equipmentsprerequisites:[],
        minimumCapacity: '',
        maximumCapacity: '',
        tagItem: '',
        isPaid: false,
        rate: '',
        feeDescription: '',
        duration: '',
        
    });
   const [selectedTagdataDetails,setSelectedTagdataDetails] = useState(0)
  
    const { data: tagData, error, mutate } = useFrappeGetDoc('Item', classForm.tagItem);

    useEffect(() => {
        if (classForm.tagItem && tagData?.standard_rate > 0) {
            setSelectedTagdataDetails(tagData.standard_rate);
            setClassForm((prev) => ({ ...prev, rate: String(tagData.standard_rate) }));
        }
    }, [classForm.tagItem, tagData]);
    
    

    const [locationOptions, setLocationOptions] = useState([]); 
    const [classOptions, setClassOptions] = useState([]); 
    const [workoutOptions, setWorkoutOptions] = useState([]); 
    const [gymEquipmentOptions, setGymEquipment] = useState([]); 
    const [tagptions, setTagOptions] = useState([]); 


    const fetchTagsOptions = (inputValue: any) => {
        let categorytype = classForm?.category == 'Class' ? 'Classes' : 'Services'
        console.log(categorytype)
        if (inputValue.length > 0) {
            const searchParams = {
                doctype: 'Item',
                txt: inputValue,
                filters: {'item_group': categorytype}
            };
            call
                .get('frappe.desk.search.search_link', searchParams)
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
                doctype: 'Go Location',
                txt: inputValue,
            };
            call
                .get('frappe.desk.search.search_link', searchParams)
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
                doctype: 'Gym Equipment',
                txt: inputValue,
            };
            call
                .get('frappe.desk.search.search_link', searchParams)
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
                doctype: 'Class Type Master',
                txt: inputValue,
            };
            call
                .get('frappe.desk.search.search_link', searchParams)
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
                doctype: 'Workout Master',
                txt: inputValue,
            };
            call
                .get('frappe.desk.search.search_link', searchParams)
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
        const fieldValue = type === 'checkbox' ? checked : value;
        setClassForm((prev) => ({ ...prev, [name]: fieldValue }));
    };

    const handleLocationChange = (selectedOption: any) => {
        setClassForm((prev) => ({ ...prev, location: selectedOption ? selectedOption.value : '' }));
    };

    const handleTagChange = (selectedOption: any) => {
        setClassForm((prev) => ({ ...prev, tagItem: selectedOption ? selectedOption.value : '' }));
    };

    const handleEquipmentChange = (selectedOptions: any) => {
        const equipmentsprerequisites = selectedOptions
            ? selectedOptions.map((option: any) => option.value)
            : [];
        setClassForm((prev) => ({ ...prev, equipmentsprerequisites })); 
    };
    
    const handleTypeChange = (selectedOption: any) => {
        setClassForm((prev) => ({ ...prev, type: selectedOption ? selectedOption.value : '' }));
    };

    const handleWorkoutChange = (selectedOptions: any) => {
        const workouts = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setClassForm((prev) => ({ ...prev, workouts }));
    };

    const generateRandomString = (length = 10) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

if (classForm?.category == 'Workout') {
        const workoutGroups = classForm.workouts?.map((workout: string) => ({
            "doctype": "Workout Group",
            "workout": workout,
        }));
        const equipmentGroups = classForm.equipmentsprerequisites?.map((equipment: string) => ({
            "doctype": "Equipment Group",
            "equipment_name": equipment,
        }));
        const randomName = `new-classes-${generateRandomString()}`;

    db.createDoc('Classes', {
        "docstatus": 0,
        "doctype": "Classes",
        "name": randomName, 
        "owner": currentUser,
        "type": "Workout",
        "workouts": workoutGroups,
        "req_capacity": classForm?.requiredCapacity == true ? 1 : 0,
        "equipments_pre":equipmentGroups,
        "is_paid": classForm.isPaid ? 1 : 0,
        "status": classForm?.status,
        "visibility_status": classForm?.visibilityStatus,
        "class_title": classForm?.title,
        "location": classForm?.location,
        "class_description": classForm?.description,
        "class_type": classForm?.type,
        "prequisites": classForm?.prerequisites,
        "minimum_capacity": classForm?.minimumCapacity || 0,
        "maximum_capacity": classForm?.maximumCapacity || 0
    })
        .then((doc) => console.log(doc))
        .catch((error) => console.error(error));
}

if (classForm?.category == 'Service') {
    const equipmentGroups = classForm.equipmentsprerequisites?.map((equipment: string) => ({
        "doctype": "Equipment Group",
        "equipment_name": equipment,
    }));
    const randomName = `new-classes-${generateRandomString()}`;
        db.createDoc('Classes', {
            "docstatus": 0,
            "doctype": "Classes",
            "name": randomName,
            "owner": currentUser,
            "type": "Service",
            "workouts": [],
            "req_capacity": classForm?.requiredCapacity == true ? 1 : 0,
            "equipments_pre": equipmentGroups,
            "is_paid": classForm.isPaid ? 1 : 0,
            "status": classForm?.status,
            "visibility_status": classForm?.visibilityStatus,
            "tag_item": classForm?.tagItem,
            "class_title": classForm?.title,
            "location": classForm?.location,
            "class_description": classForm?.description,
            "class_type": classForm?.type,
            "duration": classForm?.duration,
            "prequisites": classForm?.prerequisites,
            "class_fee": classForm?.rate,
            "fee_description": classForm?.feeDescription
        })
        .then((doc) => console.log(doc))
        .catch((error) => console.error(error));
    
}

if (classForm?.category == 'Class') {
    const workoutGroups = classForm.workouts?.map((workout: string) => ({
        "doctype": "Workout Group",
        "workout": workout,
    }));
    const equipmentGroups = classForm.equipmentsprerequisites?.map((equipment: string) => ({
        "doctype": "Equipment Group",
        "equipment_name": equipment,
    }));
    const randomName = `new-classes-${generateRandomString()}`;

db.createDoc('Classes', {
    "docstatus": 0,
    "doctype": "Classes",
    "name": randomName,
    "owner": currentUser,
    "type": "Class",
    "workouts": workoutGroups,
    "req_capacity": classForm?.requiredCapacity == true ? 1 : 0,
    "equipments_pre": equipmentGroups,
    "is_paid": classForm.isPaid ? 1 : 0,
    "status": classForm.status,
    "visibility_status": classForm.visibilityStatus,
    "class_title": classForm.title,
    "location": classForm.location,
    "minimum_capacity": classForm.minimumCapacity,
    "maximum_capacity": classForm.maximumCapacity,
    "tag_item": classForm.tagItem,
    "class_description": classForm.description,
    "class_type": classForm.type,
    "prequisites": classForm.prerequisites,
    "class_fee": classForm.rate,
    "fee_description": classForm.feeDescription
})
    .then((doc) => console.log(doc))
    .catch((error) => console.error(error));
}
       
    };

    
    const renderConditionalFields = () => {
        if (classForm.category === 'Class') {
            return (
                <>
                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Minimum Capacity
                            <input
                                type="number"
                                name="minimumCapacity"
                                value={classForm.minimumCapacity}
                                onChange={handleInputChange}
                                placeholder="Minimum Capacity"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Maximum Capacity
                            <input
                                type="number"
                                name="maximumCapacity"
                                value={classForm.maximumCapacity}
                                onChange={handleInputChange}
                                placeholder="Maximum Capacity"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 min-w-[250px]">
                            Tag Item
                          

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
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        borderColor: state.isFocused ? '#007BFF' : '#444', 
                                        boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#007BFF' : '#666',
                                        },
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    option: (baseStyles, { isFocused }) => ({
                                        ...baseStyles,
                                        backgroundColor: isFocused ? (appearance === 'dark' ? '#555' : '#eee') : 'transparent',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    input: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                }}
                            />
                        </label>

                        <label className="flex-1 min-w-[250px] flex items-center">
                            <input
                                type="checkbox"
                                name="isPaid"
                                checked={classForm.isPaid}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Is Paid
                        </label>
                    </Flex>

                    {classForm.isPaid && (
                        <Flex className="flex-wrap gap-4">
                            <label className="flex-1 mr-4 min-w-[250px]">
                                Rate
                                <input
                                    type="number"
                                    name="rate"
                                    value={classForm.rate}
                                    onChange={handleInputChange}
                                    placeholder="Rate"
                                    className="border px-2 py-4 rounded-lg w-full"
                                />
                            </label>
                            <label className="flex-1 min-w-[250px]">
                                Fee Description
                                <input
                                    type="text"
                                    name="feeDescription"
                                    value={classForm.feeDescription}
                                    onChange={handleInputChange}
                                    placeholder="Fee Description"
                                    className="border px-2 py-4 rounded-lg w-full"
                                />
                            </label>
                        </Flex>
                    )}
                </>
            );
        }

        if (classForm.category === 'Service') {
            return (
                <>
                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Minimum Capacity
                            <input
                                type="number"
                                name="minimumCapacity"
                                value={classForm.minimumCapacity}
                                onChange={handleInputChange}
                                placeholder="Minimum Capacity"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Maximum Capacity
                            <input
                                type="number"
                                name="maximumCapacity"
                                value={classForm.maximumCapacity}
                                onChange={handleInputChange}
                                placeholder="Maximum Capacity"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                    <label className="flex-1 min-w-[250px]">
                            Tag Item
                          

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
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        borderColor: state.isFocused ? '#007BFF' : '#444', 
                                        boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#007BFF' : '#666',
                                        },
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    option: (baseStyles, { isFocused }) => ({
                                        ...baseStyles,
                                        backgroundColor: isFocused ? (appearance === 'dark' ? '#555' : '#eee') : 'transparent',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    input: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                }}
                            />
                        </label>
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Duration (mins)
                            <input
                                type="number"
                                name="duration"
                                value={classForm.duration}
                                onChange={handleInputChange}
                                placeholder="Duration (mins)"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 min-w-[250px] flex items-center">
                            <input
                                type="checkbox"
                                name="isPaid"
                                checked={classForm.isPaid}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Is Paid
                        </label>
                    </Flex>

                    {classForm.isPaid && (
                        <Flex className="flex-wrap gap-4">
                            <label className="flex-1 mr-4 min-w-[250px]">
                                Rate
                                <input
                                    type="number"
                                    name="rate"
                                    value={classForm.rate}
                                    onChange={handleInputChange}
                                    placeholder="Rate"
                                    className="border px-2 py-4 rounded-lg w-full"
                                    disabled={selectedTagdataDetails > 0} 
                                />
                            </label>
                            <label className="flex-1 min-w-[250px]">
                                Fee Description
                                <input
                                    type="text"
                                    name="feeDescription"
                                    value={classForm.feeDescription}
                                    onChange={handleInputChange}
                                    placeholder="Fee Description"
                                    className="border px-2 py-4 rounded-lg w-full"
                                />
                            </label>
                        </Flex>
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
                    <Link to="/channel" className="block bg-transparent hover:bg-transparent active:bg-transparent sm:hidden">
                        <BiChevronLeft size="24" className="block text-gray-12" />
                    </Link>
                    <Heading size="5">Create Class</Heading>
                </Flex>
            </PageHeader>

            <div className="mx-10 my-20">
                <form onSubmit={SubmitHandler} className="space-y-6">
                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Title
                            <input
                                type="text"
                                name="title"
                                value={classForm.title}
                                onChange={handleInputChange}
                                placeholder="Class Title"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        {classForm.category !== 'Service'  && (
                            <label className="flex-1 min-w-[250px]">
                                Workouts
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
                                            backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                            borderColor: state.isFocused ? '#007BFF' : '#444', 
                                            boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                                            '&:hover': {
                                                borderColor: state.isFocused ? '#007BFF' : '#666',
                                            },
                                        }),
                                        menu: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                            color: appearance === 'dark' ? '#fff' : '#000',
                                        }),
                                        option: (baseStyles, { isFocused }) => ({
                                            ...baseStyles,
                                            backgroundColor: isFocused ? (appearance === 'dark' ? '#555' : '#eee') : 'transparent',
                                            color: appearance === 'dark' ? '#fff' : '#000',
                                        }),
                                        multiValue: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: appearance === 'dark' ? '#444' : '#ddd',
                                            color: appearance === 'dark' ? '#fff' : '#000',
                                        }),
                                        multiValueLabel: (baseStyles) => ({
                                            ...baseStyles,
                                            color: appearance === 'dark' ? '#fff' : '#000',
                                        }),
                                        singleValue: (baseStyles) => ({
                                            ...baseStyles,
                                            color: appearance === 'dark' ? '#fff' : '#000',
                                        }),
                                        input: (baseStyles) => ({
                                            ...baseStyles,
                                            color: appearance === 'dark' ? '#fff' : '#000',
                                        }),
                                    }}
                                />
                            </label>
                        )}
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Location
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
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        borderColor: state.isFocused ? '#007BFF' : '#444', 
                                        boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#007BFF' : '#666',
                                        },
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    option: (baseStyles, { isFocused }) => ({
                                        ...baseStyles,
                                        backgroundColor: isFocused ? (appearance === 'dark' ? '#555' : '#eee') : 'transparent',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    input: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                }}
                            />
                        </label>

                        <label className="flex-1 min-w-[250px]">
                            Type
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
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        borderColor: state.isFocused ? '#007BFF' : '#444', 
                                        boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#007BFF' : '#666',
                                        },
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    option: (baseStyles, { isFocused }) => ({
                                        ...baseStyles,
                                        backgroundColor: isFocused ? (appearance === 'dark' ? '#555' : '#eee') : 'transparent',
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                    input: (baseStyles) => ({
                                        ...baseStyles,
                                        color: appearance === 'dark' ? '#fff' : '#000',
                                    }),
                                }}
                            />
                        </label>
                    </Flex>

                    <label className="w-full mr-4">
                        Description
                        <textarea
                            name="description"
                            value={classForm.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="border px-2 py-4 rounded-lg w-full"
                            rows={3}
                        />
                    </label>

                    <label className="flex-1 min-w-[250px]">
    Equipments Prerequisites
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
                backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                borderColor: state.isFocused ? '#007BFF' : '#444',
                boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                '&:hover': {
                    borderColor: state.isFocused ? '#007BFF' : '#666',
                },
            }),
            menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: appearance === 'dark' ? '#333' : '#fff',
                color: appearance === 'dark' ? '#fff' : '#000',
            }),
            option: (baseStyles, { isFocused }) => ({
                ...baseStyles,
                backgroundColor: isFocused ? (appearance === 'dark' ? '#555' : '#eee') : 'transparent',
                color: appearance === 'dark' ? '#fff' : '#000',
            }),
            multiValue: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: appearance === 'dark' ? '#444' : '#ddd',
                color: appearance === 'dark' ? '#fff' : '#000',
            }),
            multiValueLabel: (baseStyles) => ({
                ...baseStyles,
                color: appearance === 'dark' ? '#fff' : '#000',
            }),
            singleValue: (baseStyles) => ({
                ...baseStyles,
                color: appearance === 'dark' ? '#fff' : '#000',
            }),
            input: (baseStyles) => ({
                ...baseStyles,
                color: appearance === 'dark' ? '#fff' : '#000',
            }),
        }}
    />
</label>


                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Category
                            <select
                                name="category"
                                value={classForm.category}
                                onChange={handleInputChange}
                                className="border px-2 py-4 rounded-lg w-full"
                            >
                                <option value="Workout">Workout</option>
                                <option value="Class">Class</option>
                                <option value="Service">Service</option>
                            </select>
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Prerequisites
                            <input
                                type="text"
                                name="prerequisites"
                                value={classForm.prerequisites}
                                onChange={handleInputChange}
                                placeholder="Prerequisites"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                        Status
                            <select
                                name="status"
                                value={classForm.status}
                                onChange={handleInputChange}
                                className="border px-2 py-4 rounded-lg w-full"
                            >
                                <option value="Active">Active</option>
                                <option value="Deactive">Deactive</option>
                               
                            </select>
                        </label>
                        <label className="flex-1 mr-4 min-w-[250px]">
                        Visibility Status
                            <select
                                name="visibilityStatus"
                                value={classForm.category}
                                onChange={handleInputChange}
                                className="border px-2 py-4 rounded-lg w-full"
                            >
                                <option value="Private">Private</option>
                                <option value="Public">Public</option>
                            </select>
                        </label>
                    </Flex>


                    {classForm.category !== 'Workout' && renderConditionalFields()}

                    {classForm.category === 'Workout' && (
    <>
        <Flex className="flex-wrap gap-4">
            <label className="flex-1 mr-4 min-w-[250px] flex items-center">
                <input
                    type="checkbox"
                    name="requiredCapacity"
                    checked={classForm.requiredCapacity}
                    onChange={handleInputChange}
                    className="mr-2"
                />
                Required Capacity
            </label>
        </Flex>

        {classForm.requiredCapacity && (
            <Flex className="flex-wrap gap-4">
                <label className="flex-1 mr-4 min-w-[250px]">
                    Minimum Capacity
                    <input
                        type="number"
                        name="minimumCapacity"
                        value={classForm.minimumCapacity}
                        onChange={handleInputChange}
                        placeholder="Minimum Capacity"
                        className="border px-2 py-4 rounded-lg w-full"
                    />
                </label>
                <label className="flex-1 min-w-[250px]">
                    Maximum Capacity
                    <input
                        type="number"
                        name="maximumCapacity"
                        value={classForm.maximumCapacity}
                        onChange={handleInputChange}
                        placeholder="Maximum Capacity"
                        className="border px-2 py-4 rounded-lg w-full"
                    />
                </label>
            </Flex>
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
