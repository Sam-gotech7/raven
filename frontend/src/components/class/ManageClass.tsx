import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context


const ManageClass: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { appearance } = useTheme(); // Get the current theme (light or dark)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Set the number of items per page

    // Sample data
    const products = [
        { name: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: '$2999' },
        { name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: '$1999' },
        { name: 'Dell XPS 13', color: 'Black', category: 'Laptop', price: '$1499' },
        { name: 'Lenovo ThinkPad X1', color: 'Black', category: 'Laptop', price: '$1899' },
    ];

    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    // Handle pagination click
    const paginate = (pageNumber:any) => setCurrentPage(pageNumber);



    return (
        <>
            <PageHeader>
                <Flex align='center' gap='3' className="h-8">
                    <Link to='/channel' className="block bg-transparent hover:bg-transparent active:bg-transparent sm:hidden">
                        <BiChevronLeft size='24' className="block text-gray-12" />
                    </Link>
                    <Heading size='5'>Manage Class</Heading>
                </Flex>
            </PageHeader>

            <div className={`relative my-20 overflow-x-auto shadow-md sm:rounded-lg mx-10 ${
                appearance === 'dark' ? 'dark' : ''
            }`}>
                <div className="flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className={`block p-2 ps-10 text-sm border rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500 ${
                                appearance === 'dark' 
                                    ? 'text-white bg-gray-700 border-gray-600 placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    : 'text-gray-900 border-gray-300 bg-gray-50'
                            }`}
                            placeholder="Search for items"
                        />
                    </div>

                    <div>
                     <Link className="p-4 font-semibold" to={'/channel/class/create'}>Add Class</Link>
                    </div>
                </div>

                <table className={`w-full rounded-lg text-sm text-left ${
                    appearance === 'dark' ? 'text-gray-400 bg-gray-700 dark' : 'text-gray-500 bg-white'
                }`}>
                    <thead className={`text-xs uppercase ${
                        appearance === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-gray-50'
                    }`}>
                        <tr>
                            <th scope="col" className="px-6 py-3">
                            ID</th>
                            <th scope="col" className="px-6 py-3">
                            Title</th>
                            <th scope="col" className="px-6 py-3">
                            Description</th>
                           
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr
                                key={index}
                                className={`border-b hover:bg-gray-50 ${
                                    appearance === 'dark' ? 'bg-gray-800 border-gray-700 dark:hover:bg-gray-600' : 'bg-white'
                                }`}
                            >
                                <th
                                    scope="row"
                                    className={`px-6 py-4 font-medium ${
                                        appearance === 'dark' ? 'text-white' : 'text-gray-900'
                                    } whitespace-nowrap`}
                                >
                                    {item.name}
                                </th>
                                <td className="px-6 py-4">{item.color}</td>
                                <td className="px-6 py-4">{item.category}</td>
                      
                                <td className="px-6 py-4">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing <b>1-5</b> of 45
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              Prev
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
              1
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              2
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              3
            </button>
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
              Next
            </button>
          </div>
        </div>
    

            </div>
        </>
    );
};

export const Component = ManageClass;
