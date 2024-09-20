import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context
import { MdDelete } from "react-icons/md";

const CreateClass = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { appearance } = useTheme(); // Get the current theme (light or dark)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Set the number of items per page

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

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setClassForm((prev) => ({ ...prev, [name]: fieldValue }));
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

            {/* Class Form */}
            <div className="mx-10 my-20">
                <form onSubmit={SubmitHandler} className="space-y-6">
                    {/* Flex container for fields */}
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
                            <input
                                type="text"
                                name="location"
                                value={classForm.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                                className="border px-2 py-4 rounded-lg w-full"
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
                        type='submit'
                        className='px-7 cursor-pointer hover:scale-105 text-lg font-semibold py-2 bg-transparent border rounded-lg border-blue-900'
                    >
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export const Component = CreateClass;
