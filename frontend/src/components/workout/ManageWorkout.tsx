import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context

const ManageWorkout = () => {
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
                    <Heading size='5'>Create Workouts</Heading>
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
                     <Link className="p-4 font-semibold" to={'/channel/workout/create'}>Add Workout</Link>
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
                            <th scope="col" className="px-6 py-3">Workout Name</th>
                            <th scope="col" className="px-6 py-3">
                            Category</th>
                            <th scope="col" className="px-6 py-3">
                            Status</th>
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
                                <td className="px-6 py-4">{item.price}</td>
                                <td className="px-6 py-4">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
<div className="flex justify-center items-center space-x-2 py-4">
  {/* Previous button */}
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-200"
  >
    &lt;
  </button>

  {/* Page numbers */}
  <span
    onClick={() => paginate(1)}
    className={`px-2 py-1 cursor-pointer ${
      currentPage === 1 ? 'bg-blue-500 text-white rounded-full' : ''
    }`}
  >
    1
  </span>

  {currentPage > 3 && (
    <span className="px-2 py-1">...</span> // Ellipsis for skipping pages
  )}

  {currentPage > 2 && (
    <span
      onClick={() => paginate(currentPage - 1)}
      className="px-2 py-1 cursor-pointer rounded-full hover:bg-gray-200"
    >
      {currentPage - 1}
    </span>
  )}

  {/* Current Page */}
  <span
    className="px-2 py-1 bg-blue-500 text-white rounded-full"
  >
    {currentPage}
  </span>

  {currentPage < Math.ceil(products.length / itemsPerPage) - 1 && (
    <span
      onClick={() => paginate(currentPage + 1)}
      className="px-2 py-1 cursor-pointer rounded-full hover:bg-gray-200"
    >
      {currentPage + 1}
    </span>
  )}

  {currentPage < Math.ceil(products.length / itemsPerPage) - 2 && (
    <span className="px-2 py-1">...</span> // Ellipsis for skipping pages
  )}

  <span
    onClick={() => paginate(Math.ceil(products.length / itemsPerPage))}
    className={`px-2 py-1 cursor-pointer ${
      currentPage === Math.ceil(products.length / itemsPerPage) ? 'bg-blue-500 text-white rounded-full' : ''
    }`}
  >
    {Math.ceil(products.length / itemsPerPage)}
  </span>

  {/* Next button */}
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
    className="px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-200"
  >
    &gt;
  </button>
</div>

            </div>
        </>
    );
};

export const Component = ManageWorkout;
