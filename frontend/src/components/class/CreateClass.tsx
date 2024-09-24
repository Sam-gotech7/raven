import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context
import { MdDelete } from "react-icons/md";
import { FrappeConfig, FrappeContext, FrappeError } from "frappe-react-sdk";
import Select from 'react-select'; // Import React Select

const CreateClass = () => {
    const { appearance } = useTheme(); // Get the current theme (light or dark)
    const { call } = useContext(FrappeContext) as FrappeConfig;

    const [classForm, setClassForm] = useState({
        title: '',
        workouts: '',
        location: '',
        type: '',
        description: '',
        category: '',
        prerequisites: '',
        equipments: '',
        status: '',
        visibilityStatus: 'Private', // Default visibility
        requiredCapacity: false, // Checkbox for required capacity
        minimumCapacity: '',
        maximumCapacity: '',
    });

    const [locationOptions, setLocationOptions] = useState([]); // State for storing location options

    // Fetch location suggestions when the user types
    const fetchLocationOptions = (inputValue: string) => {
        if (inputValue.length > 0) { // Fetch only if input is greater than 2 characters
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
                        setLocationOptions(options); // Update the location options
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
        setClassForm((prev) => ({ ...prev, location: selectedOption.value })); // Set the selected location
    };

    const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(classForm);
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
                        <label className="flex-1 min-w-[250px]">
                            Workouts
                            <input
                                type="text"
                                name="workouts"
                                value={classForm.workouts}
                                onChange={handleInputChange}
                                placeholder="Workouts"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Location
                            {/* React Select for Location Autocomplete */}
                            <Select
                                options={locationOptions} // The options for the dropdown
                                onInputChange={fetchLocationOptions} // Fetch options when user types
                                onChange={handleLocationChange} // Handle selecting an option
                                placeholder="Search Location"
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable // Allow clearing the selection
                                name="location"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Type
                            <input
                                type="text"
                                name="type"
                                value={classForm.type}
                                onChange={handleInputChange}
                                placeholder="Type"
                                className="border px-2 py-4 rounded-lg w-full"
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

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Category
                            <input
                                type="text"
                                name="category"
                                value={classForm.category}
                                onChange={handleInputChange}
                                placeholder="Category"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
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
                            Equipments
                            <input
                                type="text"
                                name="equipments"
                                value={classForm.equipments}
                                onChange={handleInputChange}
                                placeholder="Equipments"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Status
                            <input
                                type="text"
                                name="status"
                                value={classForm.status}
                                onChange={handleInputChange}
                                placeholder="Status"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Visibility Status
                            <select
                                name="visibilityStatus"
                                value={classForm.visibilityStatus}
                                onChange={handleInputChange}
                                className="border px-2 py-4 rounded-lg w-full"
                            >
                                <option value="Private">Private</option>
                                <option value="Public">Public</option>
                            </select>
                        </label>

                        <label className="flex-1 min-w-[250px] flex items-center">
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

                    {/* Conditionally render Minimum and Maximum Capacity based on the checkbox */}
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
