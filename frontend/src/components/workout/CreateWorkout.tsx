import { useContext, useState } from "react"
import { FrappeConfig, FrappeContext, FrappeError } from "frappe-react-sdk"
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context
import { MdDelete } from "react-icons/md";

const CreateWorkout = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { appearance } = useTheme(); // Get the current theme (light or dark)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Set the number of items per page
    const { call } = useContext(FrappeContext) as FrappeConfig

    const [workoutForm, setWorkoutForm] = useState({
        workoutName: '',
        company: '',
        category: '',
        description: '',
        duration: '',
        targetedMuscleGroup: '',
        equipments: '',
        difficultyLevel: '',
        notes: '',
        benefits: '',
        author: '',
        visibility: 'Private', // Default visibility
        creationDate: new Date().toLocaleDateString(),
        overallRating: '',
    });

    const [exerciseList, setExerciseList] = useState([
        {
            exerciseName: '',
            sets: '',
            reps: '',
            weight: '',
            rest: '',
            thumbnail: null,
            supportVideo: null,
        },
    ]);

    // Handle workout form changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setWorkoutForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle exercise list changes
    const handleExerciseChange = (index: number, e: any) => {
        const { name, value } = e.target;
        const updatedExerciseList = [...exerciseList];
        updatedExerciseList[index][name] = value;
        setExerciseList(updatedExerciseList);
    };

    // Handle file change for thumbnail and support video
    const handleFileChange = (index: number, e: any) => {
        const { name, files } = e.target;
        const updatedExerciseList = [...exerciseList];
        updatedExerciseList[index][name] = files[0]; // Assign the selected file
        setExerciseList(updatedExerciseList);
    };

    // Add new exercise
    const addExercise = () => {
        setExerciseList([
            ...exerciseList,
            {
                exerciseName: '',
                sets: '',
                reps: '',
                weight: '',
                rest: '',
                thumbnail: null,
                supportVideo: null,
            },
        ]);
    };

    // Remove exercise
    const removeExercise = (index: number) => {
        const updatedExerciseList = [...exerciseList];
        updatedExerciseList.splice(index, 1);
        setExerciseList(updatedExerciseList);
    };

    const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  
        console.log(workoutForm);
        console.log(exerciseList);
    };
    
    const searchParams = {
        doctype: 'Go Location',
        txt: '',
      };
      call
        .get('frappe.desk.search.search_link', searchParams)
        .then((result) => {console.log("result") 
            console.log(result)})
        .catch((error) => console.error(error));


    return (
        <>
            <PageHeader>
                <Flex align="center" gap="3" className="h-8">
                    <Link to="/channel" className="block bg-transparent hover:bg-transparent active:bg-transparent sm:hidden">
                        <BiChevronLeft size="24" className="block text-gray-12" />
                    </Link>
                    <Heading size="5">Create Workouts</Heading>
                </Flex>
            </PageHeader>

            {/* Workout Form */}
            <div className="mx-10 my-20">
                <form onSubmit={SubmitHandler} className="space-y-6">
                    {/* Flex container for fields */}
                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Workout Name
                            <input
                                type="text"
                                name="workoutName"
                                value={workoutForm.workoutName}
                                onChange={handleInputChange}
                                placeholder="Workout Name"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Company
                            <input
                                type="text"
                                name="company"
                                value={workoutForm.company}
                                onChange={handleInputChange}
                                placeholder="Company"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Category
                            <input
                                type="text"
                                name="category"
                                value={workoutForm.category}
                                onChange={handleInputChange}
                                placeholder="Category"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Duration (mins)
                            <input
                                type="text"
                                name="duration"
                                value={workoutForm.duration}
                                onChange={handleInputChange}
                                placeholder="Duration (mins)"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <label className="w-full mr-4">
                        Description
                        <textarea
                            name="description"
                            value={workoutForm.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="border px-2 py-4 rounded-lg w-full"
                            rows={3}
                        />
                    </label>

                    <label className="w-full mr-4">
                        Notes/Instructions
                        <textarea
                            name="notes"
                            value={workoutForm.notes}
                            onChange={handleInputChange}
                            placeholder="Notes/Instructions"
                            className="border px-2 py-4 mr-4 rounded-lg w-full"
                            rows={3}
                        />
                    </label>

                    {/* Exercise List */}
                    <div className="my-10">
                        <Heading size="5">Exercises</Heading>
                        {exerciseList.map((exercise, index) => (
                            <div key={index} className="space-y-4 border-b pb-4 mb-4">
                                <Flex className="flex-wrap gap-4">
                                    <label className="flex-1 mr-4 min-w-[250px]">
                                        Exercise Name
                                        <input
                                            type="text"
                                            name="exerciseName"
                                            value={exercise.exerciseName}
                                            onChange={(e) => handleExerciseChange(index, e)}
                                            placeholder="Exercise Name"
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                    <label className="flex-1 min-w-[250px]">
                                        Sets
                                        <input
                                            type="text"
                                            name="sets"
                                            value={exercise.sets}
                                            onChange={(e) => handleExerciseChange(index, e)}
                                            placeholder="Sets"
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                </Flex>

                                <Flex className="flex-wrap gap-4">
                                    <label className="flex-1 mr-4 min-w-[250px]">
                                        Reps
                                        <input
                                            type="text"
                                            name="reps"
                                            value={exercise.reps}
                                            onChange={(e) => handleExerciseChange(index, e)}
                                            placeholder="Reps"
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                    <label className="flex-1 min-w-[250px]">
                                        Weight (lbs)
                                        <input
                                            type="text"
                                            name="weight"
                                            value={exercise.weight}
                                            onChange={(e) => handleExerciseChange(index, e)}
                                            placeholder="Weight (lbs)"
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                </Flex>

                                <Flex className="flex-wrap gap-4">
                                    <label className="flex-1 mr-4 min-w-[250px]">
                                        Rest (Sec)
                                        <input
                                            type="text"
                                            name="rest"
                                            value={exercise.rest}
                                            onChange={(e) => handleExerciseChange(index, e)}
                                            placeholder="Rest (Sec)"
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                    <label className="flex-1 min-w-[250px]">
                                        Thumbnail
                                        <input
                                            type="file"
                                            name="thumbnail"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(index, e)}
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                </Flex>

                                <Flex className="flex-wrap gap-4">
                                    <label className="flex-1 mr-4 min-w-[250px]">
                                        Support Video
                                        <input
                                            type="file"
                                            name="supportVideo"
                                            accept="video/*"
                                            onChange={(e) => handleFileChange(index, e)}
                                            className="border px-2 py-4 rounded-lg w-full"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(index)}
                                        className="text-red-500  cursor-pointer bg-transparent hover:text-red-700"
                                    >
                                       <MdDelete className='mt-3' size={26} color='red' />

                                    </button>
                                </Flex>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addExercise}
                            className="text-blue-500 cu px-3 py-2 bg-transparent border border-blue-900 rounded-lg hover:text-blue-700 mt-4"
                        >
                            Add Exercise
                        </button>
                    </div>

                    {/* Other fields */}
                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Targeted Muscle Group
                            <input
                                type="text"
                                name="targetedMuscleGroup"
                                value={workoutForm.targetedMuscleGroup}
                                onChange={handleInputChange}
                                placeholder="Targeted Muscle Group"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Equipments
                            <input
                                type="text"
                                name="equipments"
                                value={workoutForm.equipments}
                                onChange={handleInputChange}
                                placeholder="Equipments"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Difficulty Level
                            <input
                                type="text"
                                name="difficultyLevel"
                                value={workoutForm.difficultyLevel}
                                onChange={handleInputChange}
                                placeholder="Difficulty Level"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Benefits
                            <input
                                type="text"
                                name="benefits"
                                value={workoutForm.benefits}
                                onChange={handleInputChange}
                                placeholder="Benefits"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <Flex className="flex-wrap  gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Author
                            <input
                                type="text"
                                name="author"
                                value={workoutForm.author}
                                onChange={handleInputChange}
                                placeholder="Author"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Visibility
                            <select
                                name="visibility"
                                value={workoutForm.visibility}
                                onChange={handleInputChange}
                                className="border px-2 py-4 rounded-lg w-full"
                            >
                                <option value="Private">Private</option>
                                <option value="Public">Public</option>
                            </select>
                        </label>
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                        <label className="flex-1 mr-4 min-w-[250px]">
                            Creation Date
                            <input
                                type="text"
                                name="creationDate"
                                value={workoutForm.creationDate}
                                onChange={handleInputChange}
                                placeholder="Creation Date"
                                className="border px-2 py-4 rounded-lg w-full"
                                disabled
                            />
                        </label>
                        <label className="flex-1 min-w-[250px]">
                            Overall Rating
                            <input
                                type="number"
                                name="overallRating"
                                value={workoutForm.overallRating}
                                onChange={handleInputChange}
                                placeholder="Overall Rating"
                                className="border px-2 py-4 rounded-lg w-full"
                            />
                        </label>
                    </Flex>

                    <button type='submit' className='px-7 cursor-pointer hover:scale-105 text-lg font-semibold py-2 bg-transparent border rounded-lg border-blue-900' >Save</button>
                </form>
            </div>
        </>
    );
};

export const Component = CreateWorkout;
