import { useContext, useState,useEffect } from "react"
import { FrappeConfig, FrappeContext, FrappeError ,useFrappeAuth} from "frappe-react-sdk"
import { Link } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Heading } from '@radix-ui/themes';
import { Box, Flex } from '@radix-ui/themes';
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context
import { MdDelete } from "react-icons/md";
import Select from 'react-select'; 
import { toast } from 'sonner'

const CreateWorkout = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { appearance } = useTheme(); // Get the current theme (light or dark)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Set the number of items per page
    const { call, db } = useContext(FrappeContext) as FrappeConfig
    const { currentUser } = useFrappeAuth()
    const [companyOptions, setCompanyOptions] = useState([]); 
    const [gymEquipmentOptions, setGymEquipmentOptions] = useState([]); 
    const [authorOptions, setAuthorOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [targetedMuscleOptions, setTargetedMuscleOptions] = useState([]);
    const [exerciseListOptions, setExerciseListOptions] = useState([]);

    const [workoutForm, setWorkoutForm] = useState({
        workoutName: '',
        company: '',
        category: '',
        description: '',
        duration: '',
        targetedMuscleGroup: [],
        equipments: [],
        difficultyLevel: 'Beginner',
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
        console.log(workoutForm);
        console.log(exerciseList);
        const randomName = `new-workout-master-${generateRandomString()}`;
        const targetedMuscles = workoutForm?.targetedMuscleGroup?.map((muscle: any) => ({
            "doctype": "Workout Group",
            "muscle": muscle?.value,
        }));
        const selectedEquipments = workoutForm?.equipments?.map((eqp: any) => ({
           "doctype": "Equipment Group",
           "equipment_name": eqp?.value
        }));

        const selectedExerciseList = exerciseList?.map((exer: any) => ({
           "doctype": "Exercise List",
                    "exercise_name": exer?.exerciseName,
                    "sets": exer?.sets,
                    "reps": exer?.reps,
                    "weight": exer?.weight,
                    "rest": exer?.rest,
                    "thumbnail": exer?.thumbnail,
                    "support_video": exer?.supportVideo
         }));
        db.createDoc('Workout Master', {
            "docstatus": 0,
            "doctype": "Workout Master",
            "name": randomName,
            "owner": currentUser,
            "targeted_muscle_group": targetedMuscles,
            "company": workoutForm?.company,
            "equipments": selectedEquipments,
            "difficulty_level": workoutForm?.difficultyLevel,
            "exercise_list": selectedExerciseList ,
            "visibility": workoutForm?.visibility,
            "workout_name":workoutForm?.workoutName,
            "category": workoutForm?.category,
            "duration": workoutForm?.duration,
            "description": workoutForm?.description,
            "notesinstructions": workoutForm?.notes,
            "benifites": workoutForm?.benefits,
            "creater__author": workoutForm?.author,
            "creation_date": workoutForm?.creationDate,
            "overall_rating": workoutForm?.overallRating
        })
            .then((doc) => {
                toast.success("Workout Add successfully")
            }    )
            .catch((error) => console.error(error));
    
    };
    
     // Fetch data for options
     const fetchCompany = async () => {
        const searchParams = { doctype: 'Company', txt: '' };
        call.get('frappe.desk.search.search_link', searchParams)
            .then((result) => setCompanyOptions(result.message.map((company: any) => ({ label: company.value, value: company.value }))))
            .catch((error) => console.error(error));
    };

    const fetchWorkoutCategory = async () => {
        const searchParamscategory = { doctype: 'Workout Category', txt: '' };
        call.get('frappe.desk.search.search_link', searchParamscategory)
            .then((result) => setCategoryOptions(result.message.map((category: any) => ({ label: category.value, value: category.value }))))
            .catch((error) => console.error(error));
    };

    const fetchTargetedMuscles = async () => {
        const searchParams = { doctype: 'Muscle Master', txt: '' };
        call.get('frappe.desk.search.search_link', searchParams)
            .then((result) => setTargetedMuscleOptions(result.message.map((muscle: any) => ({ label: muscle.value, value: muscle.value }))))
            .catch((error) => console.error(error));
    };

    const fetchGymEquipmentOptions = () => {
        const searchParams = { doctype: 'Gym Equipment', txt: '' };
        call.get('frappe.desk.search.search_link', searchParams)
            .then((result) => setGymEquipmentOptions(result.message.map((equipment: any) => ({ label: equipment.value, value: equipment.value }))))
            .catch((error) => console.error(error));
    };

    const fetchAuthor = async () => {
        const searchParams = { doctype: 'User', txt: '' };
        call.get('frappe.desk.search.search_link', searchParams)
            .then((result) => setAuthorOptions(result.message.map((author: any) => ({ label: author.value, value: author.value }))))
            .catch((error) => console.error(error));
    };

    const fetchExerciseList = async () => {
        const searchParams = { doctype: 'Exercise Name Master', txt: '' };
        call.get('frappe.desk.search.search_link', searchParams)
            .then((result) => setExerciseListOptions(result.message.map((exercise: any) => ({ label: exercise.value, value: exercise.value }))))
            .catch((error) => console.error(error));
    };


    

    const handleSelectChange = (name: string, selectedOption: any) => {
        setWorkoutForm((prev) => ({ ...prev, [name]: selectedOption }));
    };

    // Handle react-select multi-select change
    const handleMultiSelectChange = (name: string, selectedOptions: any) => {
        setWorkoutForm((prev) => ({ ...prev, [name]: selectedOptions || [] }));
    };


    useEffect(() => {
        fetchCompany();
        fetchWorkoutCategory();
        fetchTargetedMuscles();
        fetchGymEquipmentOptions();
        fetchAuthor();
        fetchExerciseList()
    }, []);


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
                            <Select
                                value={workoutForm.company}
                                onChange={(selectedOption) => handleSelectChange("company", selectedOption)}
                                options={companyOptions}
                                placeholder="Select Company"
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

                    <Flex className="flex-wrap gap-4">
                    <label className="flex-1 mr-4 min-w-[250px]">
                            Category
                            <Select
                                value={workoutForm.category}
                                onChange={(selectedOption) => handleSelectChange("category", selectedOption)}
                                options={categoryOptions}
                                placeholder="Select Category"
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
                <Select
                    value={exerciseListOptions.find((option) => option.value === exercise.exerciseName)}
                    onChange={(selectedOption) => {
                        const updatedExerciseList = [...exerciseList];
                        updatedExerciseList[index].exerciseName = selectedOption.value;
                        setExerciseList(updatedExerciseList);
                    }}
                    options={exerciseListOptions}
                    placeholder="Select Exercise"
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
                            <Select
                                isMulti
                                value={workoutForm.targetedMuscleGroup}
                                onChange={(selectedOptions) => handleMultiSelectChange("targetedMuscleGroup", selectedOptions)}
                                options={targetedMuscleOptions}
                                placeholder="Select Targeted Muscle Group"
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
                        <label className="flex-1 min-w-[250px]">
                            Equipments
                            <Select
                                isMulti
                                value={workoutForm.equipments}
                                onChange={(selectedOptions) => handleMultiSelectChange("equipments", selectedOptions)}
                                options={gymEquipmentOptions}
                                placeholder="Select Equipments"
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
                    </Flex>

                    <Flex className="flex-wrap gap-4">
                    <label className="flex-1 mr-4 min-w-[250px]">
                            Difficulty Level
                            <select
                                name="difficultyLevel"
                                value={workoutForm.difficultyLevel}
                                onChange={handleInputChange}
                                className="border px-2 py-4 rounded-lg w-full"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
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
                            <Select
                                value={workoutForm.author}
                                onChange={(selectedOption) => handleSelectChange("author", selectedOption)}
                                options={authorOptions}
                                placeholder="Select Author"
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
                                type="date"
                                name="creationDate"
                                value={workoutForm.creationDate}
                                onChange={handleInputChange}
                                placeholder="Creation Date"
                                className="border px-2 py-4 rounded-lg w-full"
                               
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
