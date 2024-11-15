import { useContext, useState,useEffect } from "react"
import { FrappeConfig, FrappeContext, FrappeError ,useFrappeGetDoc,useFrappeAuth,useFrappeFileUpload} from "frappe-react-sdk"
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../layout/Heading/PageHeader';
import { Label, ErrorText, HelperText } from "@/components/common/Form";
import { Label as RadixLabel } from "@radix-ui/react-label";
import { Stack, HStack } from "@/components/layout/Stack";
import { useIsDesktop, useIsMobile } from "@/hooks/useMediaQuery";
import { DIALOG_CONTENT_CLASS } from "@/utils/layout/dialog"
import { Heading, TextField,Dialog,TextArea, Box, Flex,Radio,Button } from "@radix-ui/themes";
import { BiChevronLeft } from 'react-icons/bi';
import { useTheme } from '../../ThemeProvider'; // Import the theme context
import { MdDelete } from "react-icons/md";
import Select from 'react-select'; 
import { toast } from 'sonner'

const EditWorkout = () => {
  const [isVideoUpload, setIsVideoUpload] = useState(true);
  const { id } = useParams();
  const formattedId = id?.replace(/-/g, " ");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate=useNavigate()
    const { appearance } = useTheme(); // Get the current theme (light or dark)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Set the number of items per page
    const { call, db } = useContext(FrappeContext) as FrappeConfig
    const { data: newWorkoutData } = useFrappeGetDoc("Workout Master", formattedId);
console.log('data', newWorkoutData)
    const { currentUser } = useFrappeAuth()
    const isMobile = useIsMobile();
    const visibilityStatusOptions = [
        { value: "Private", label: "Private" },
        { value: "Public", label: "Public" },
      ];
    const [companyOptions, setCompanyOptions] = useState([]); 
    const [isLoading,setIsLoading]=useState(false);
    const [gymEquipmentOptions, setGymEquipmentOptions] = useState([]); 
    const [authorOptions, setAuthorOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [targetedMuscleOptions, setTargetedMuscleOptions] = useState([]);
    const [exerciseListOptions, setExerciseListOptions] = useState([]);
    const { upload, error, loading, progress, isCompleted, reset } = useFrappeFileUpload();
    const [file, setFile] = useState<File>();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        if (file && workoutForm?.workoutName) {
          upload(file, {
            isPrivate: false,
            doctype: "Workout Master",
            docname: workoutForm.workoutName
          })
          .then((r) => {
            console.log(r.file_url);
            // Reset the state of the hook
            reset();
          });
        }
      };


      const [exerciseList, setExerciseList] = useState(
        newWorkoutData?.exercise_list?.map((exercise:any) => ({
          exerciseName: exercise.exercise_name || '',
          sets: exercise.sets || '',
          reps: exercise.reps || '',
          weight: exercise.weight || '',
          rest: exercise.rest || '',
          thumbnail: exercise.thumbnail || null,
          supportVideo: exercise.support_video || null,
        })) || []
      );


      
      useEffect(() => {
        if (newWorkoutData) {
          setWorkoutForm((prevForm) => ({
            ...prevForm,
            workoutName: newWorkoutData.workout_name || "",
            company: newWorkoutData.company
              ? { label: newWorkoutData.company, value: newWorkoutData.company }
              : null,
            category: newWorkoutData.category
              ? { label: newWorkoutData.category, value: newWorkoutData.category }
              : null,
            description: newWorkoutData.description || "",
            duration: newWorkoutData.duration || "",
            targetedMuscleGroup: newWorkoutData.targeted_muscle_group?.map((muscle) => ({
              label: muscle.muscle,
              value: muscle.muscle,
            })) || [],
            equipments: newWorkoutData.equipments?.map((equipment) => ({
              label: equipment.equipment_name,
              value: equipment.equipment_name,
            })) || [],
            difficultyLevel: newWorkoutData.difficulty_level || "",
            notes: newWorkoutData.notesinstructions || "",
            benefits: newWorkoutData.benifites || "",
            author: newWorkoutData.creater__author
              ? { label: newWorkoutData.creater_author, value: newWorkoutData.creater_author }
              : null,
            visibility: newWorkoutData.visibility || "Private",
            creationDate: newWorkoutData.creation_date || new Date().toLocaleDateString(),
            overallRating: newWorkoutData.overall_rating || "",
          }));
          setExerciseList(
            newWorkoutData.exercise_list?.map((exercise: any) => ({
              
              exerciseName: exercise.exercise_name || "",
              sets: exercise.sets || "",
              reps: exercise.reps || "",
              weight: exercise.weight || "",
              rest: exercise.rest || "",
              thumbnail: exercise.thumbnail || null,
              supportVideo: exercise.support_video || null,
            })) || []

            );
          setIsLoading(false);
        }
      }, [newWorkoutData])






 

    const [workoutForm, setWorkoutForm] = useState({
        workoutName: newWorkoutData?.workout_name || '',
        company: newWorkoutData?.company ? { label: newWorkoutData?.company, value: newWorkoutData?.company } : null,
        category: newWorkoutData?.category ? { label: newWorkoutData?.category, value: newWorkoutData?.category } : null,
        description: newWorkoutData?.description || '',
        duration: newWorkoutData?.duration || '',
        targetedMuscleGroup: newWorkoutData?.targeted_muscle_group?.map((muscle) => ({
          label: muscle.muscle,
          value: muscle.muscle
        })) || [],
        equipments: newWorkoutData?.equipments?.map((equipment) => ({
          label: equipment.equipment_name,
          value: equipment.equipment_name
        })) || [],
        difficultyLevel: newWorkoutData?.difficulty_level,
        notes: newWorkoutData?.notesinstructions || '',
        benefits: newWorkoutData?.benifites || '',
        author: newWorkoutData?.creater__author ? { label: newWorkoutData?.creater__author, value: newWorkoutData?.creater__author } : null,
        visibility:  newWorkoutData?.visibility || 'Private', // Default visibility
        creationDate: newWorkoutData?.creation_date || new Date().toLocaleDateString(),
        overallRating: newWorkoutData?.overall_rating || '',
    });

    if (isLoading){
      return <p>Loading</p>
    }

    console.log(workoutForm?.company)
    
    


    const handleLinkChange=(index:number,e: any)=>{
      const toastId = toast.loading("uploading Link");
      const updatedExerciseList = [...exerciseList];
      
      const updatedFields = {
                    file_url:e.target.value,
                      is_private: false,
                      doctype: "Workout Master",
                      docname: workoutForm.workoutName,
                      folder:"Home",
                      fieldname:"support_link"
                  };
      
                        call
                        .post("upload_file",updatedFields)
                        .then((r) =>{
                        updatedExerciseList[index]["supportVideo"] =r.message.file_url;
                        setExerciseList(updatedExerciseList);
                          toast.dismiss(toastId);
                          reset();
                        })
                        .catch((error) => console.error(error));
      }

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


const handleFileChange = (index: number, e: any) => {
    const { name,files } = e.target;
    const updatedExerciseList = [...exerciseList];
    if (name === "thumbnail") {
       const toastId = toast.loading('uploading thubnail');
        const file = files[0];
        setFile(file);  // Set the selected file for upload
        if (file && workoutForm?.workoutName) {
            upload(file, {
                isPrivate: false,
                doctype: "Workout Master",
                docname: workoutForm.workoutName,
            }).then((r) => {
                updatedExerciseList[index][name] = r.file_url; 
                setExerciseList(updatedExerciseList);
                toast.dismiss(toastId)
                reset(); 
            });
        }
    } else if (name === "supportVideo") {
        const toastId = toast.loading('uploading Video');
        const file = files[0];
        setFile(file);
        if (file && workoutForm?.workoutName) {
            upload(file, {
                isPrivate: false,
                doctype: "Workout Master",
                docname: workoutForm.workoutName,
            }).then((r) => {
                updatedExerciseList[index][name] = r.file_url; 
                setExerciseList(updatedExerciseList);
                toast.dismiss(toastId)
                reset(); 
            });
        }
    }

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
         const data = {
            "exercise_list": selectedExerciseList ,
        }
        //  const data = {
        //     "docstatus": 1,
        //     "doctype": "Workout Master",
        //     "name": randomName,
        //     "owner": currentUser,
        //     "targeted_muscle_group": targetedMuscles,
        //     "company": workoutForm?.company?.value,
        //     "equipments": selectedEquipments,
        //     "difficulty_level": workoutForm?.difficultyLevel,
        //     "exercise_list": selectedExerciseList ,
        //     "visibility": workoutForm?.visibility,
        //     "workout_name":workoutForm?.workoutName,
        //     "category": workoutForm?.category?.value,
        //     "duration": workoutForm?.duration,
        //     "description": workoutForm?.description,
        //     "notesinstructions": workoutForm?.notes,
        //     "benifites": workoutForm?.benefits,
        //     "creater__author": workoutForm?.author?.value || currentUser,
        //     "creation_date": workoutForm?.creationDate,
        //     "overall_rating": workoutForm?.overallRating
        // }
        console.log(data)
        db.updateDoc('Workout Master',workoutForm?.workoutName, data)
            .then((doc) => {
                toast.success("Workout Updated successfully")
                navigate('/channel/workout');
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
                    <Heading size="5">Edit Workouts</Heading>
                </Flex>
            </PageHeader>

            {/* Workout Form */}
            <div className="mx-10 my-20">
                <form onSubmit={SubmitHandler} className="space-y-6">
                    {/* Flex container for fields */}
                    <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
                        <Box style={{ flex: 1 }}>
                        <Label>Workout Name</Label>
                            <TextField.Root
                                type="text"
                                name="workoutName"
                                value={workoutForm.workoutName}
                                onChange={handleInputChange}
                                placeholder="Workout Name"
                                readOnly
                            />
                        </Box>
                        <Box style={{ flex: 1 }}>
                        <Label>Company</Label>
                            
                            <Select
                                isDisabled
                                value={workoutForm.company}
                                onChange={(selectedOption) => handleSelectChange("company", selectedOption)}
                                options={companyOptions}
                                placeholder="Select Company"
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#17191A' : '#fff',
                                        borderColor:  "#484E54",
                                        boxShadow: state.isFocused ? '0 0 0 1px #6A4CE3' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#6A4CE3' : '#666',
                                        },
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#17191A' : '#fff',
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
                        </Box>
                    </Stack>

                    <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
                    <Box style={{ flex: 1 }}>
                    <Label>Category</Label>
                            
                            <Select
                              isDisabled
                                value={workoutForm.category}
                                onChange={(selectedOption) => handleSelectChange("category", selectedOption)}
                                options={categoryOptions}
                                placeholder="Select Category"
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#17191A' : '#fff',
                                        borderColor:  "#484E54",
                                        boxShadow: state.isFocused ? '0 0 0 1px #6A4CE3' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#6A4CE3' : '#666',
                                        },
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: appearance === 'dark' ? '#17191A' : '#fff',
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
                        </Box>
                        <Box style={{ flex: 1 }}>
                        <Label>Duration (mins)</Label>            
                            <TextField.Root
                              readOnly
                                type="number"
                                name="duration"
                                value={workoutForm.duration}
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
                  <Label>Description</Label>
                        
                        <TextArea
                        readOnly
                            name="description"
                            value={workoutForm.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            rows={5}
                        />
                    </Box>
                    </Stack>

                    <Box style={{ flex: 1 }}>
                    <Label>Notes/Instructions</Label>
                        
                        <TextArea
                        readOnly
                            name="notes"
                            value={workoutForm.notes}
                            onChange={handleInputChange}
                            placeholder="Notes/Instructions"
                            rows={5}
                        />
                    </Box>

                    {/* Exercise List */}
                    <div className="my-10">
            <Heading size="5">Exercises</Heading>
            {exerciseList.map((exercise, index) => (
              <div key={index} className="space-y-4 border-b pb-4 mb-4">
                <Stack
                  direction={isMobile ? "column" : "row"}
                  gap="4"
                  style={{ width: "100%" }}
                >
                  <Box style={{ flex: 1 }}>
                    <Label>Exercise Name</Label>

                    <Select
                      value={exerciseListOptions.find(
                        (option) => option.value === exercise.exerciseName
                      )}
                      onChange={(selectedOption) => {
                        const updatedExerciseList = [...exerciseList];
                        updatedExerciseList[index].exerciseName =
                          selectedOption.value;
                        setExerciseList(updatedExerciseList);
                      }}
                      options={exerciseListOptions}
                      placeholder="Select Exercise"
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor:
                            appearance === "dark" ? "#17191A" : "#fff",
                            borderColor:  "#484E54",
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #6A4CE3"
                            : "none",
                          "&:hover": {
                            borderColor: state.isFocused ? "#6A4CE3" : "#666",
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
                    <Label htmlFor="sets">Sets</Label>

                    <TextField.Root
                      type="number"
                      name="sets"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, e)}
                      placeholder="Sets"
                    />
                  </Box>
                </Stack>

                <Stack
                  direction={isMobile ? "column" : "row"}
                  gap="4"
                  style={{ width: "100%" }}
                >
                  <Box style={{ flex: 1 }}>
                    <Label htmlFor="reps" isRequired>
                      {" "}
                      Reps
                    </Label>

                    <TextField.Root
                      type="number"
                      name="reps"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, e)}
                      placeholder="Reps"
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Label htmlFor="weight" isRequired>
                      {" "}
                      Weight (lbs)
                    </Label>

                    <TextField.Root
                      type="number"
                      name="weight"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, e)}
                      placeholder="Weight (lbs)"
                    />
                  </Box>
                </Stack>

                <Stack
                  direction={isMobile ? "column" : "row"}
                  gap="4"
                  style={{ width: "100%" }}
                >
                  <Box style={{ flex: 1 }}>
                    <Label htmlFor="rest" isRequired>
                      {" "}
                      Rest (Sec)
                    </Label>

                    <TextField.Root
                      type="number"
                      name="rest"
                      value={exercise.rest}
                      onChange={(e) => handleExerciseChange(index, e)}
                      placeholder="Rest (Sec)"
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Label htmlFor="thumbnail" isRequired>
                      {" "}
                      Thumbnail
                    </Label>


                    <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={(e) => {handleFileChange(index, e)}}
                    style={{ display: 'none' }}
                    id={`fileInput-${index}`} 
                  />
                  <input
                    type="text"
                    readOnly
                    className="border border-[#484E54] px-[10px] py-[7px] rounded-md w-full cursor-pointer"
                    value={exerciseList[index]["thumbnail"]}
                    placeholder="No file selected"
                    onClick={() => document.getElementById(`fileInput-${index}`)?.click()} 
                  />

                      
                    {/* <input
                    required
                      type="file"
                      name="thumbnail"
                      // value={exerciseList[index]["thumbnail"]}
                      accept="image/*"
                      className="border border-[#484E54] px-[10px] py-[7px] rounded-full w-full"
                      onChange={(e) => handleFileChange(index, e)}
                    /> */}
                  </Box>
                </Stack>

                <Stack
                  direction={isMobile ? "column" : "row"}
                  gap="4"
                  style={{ width: "100%" }}
                >
                  <Box style={{ flex: 1 }}>
                    <Label htmlFor="supportVideo" isRequired> Support Video</Label>

                    <Dialog.Root>
                <Dialog.Trigger>
                        <button
                      type="button"
                      className="text-blue-500 cu px-3 py-2 bg-transparent border border-blue-900 rounded-lg hover:text-blue-700"
                    >
                      {exerciseList[index]["supportVideo"] ? `${exerciseList[index]["supportVideo"].substr(7,20)}...` : `Upload Support Video`}
                    </button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                      <Dialog.Title>Upload Video or Video Link</Dialog.Title>
                      {/* <Dialog.Description size="2" mb="4">
                      </Dialog.Description> */}
                      <Flex gap="2">
                          <Radio variant="surface" name="surface" value="1" defaultChecked onChange={()=>setIsVideoUpload(true)}/>
                          <label>Upload Video</label>
                          <Radio variant="surface" name="surface" value="2" onChange={()=>setIsVideoUpload(false)}/>
                          <label>Upload Video Link</label>
	                    </Flex>
                      <Flex direction="column" gap="3" m="4">
                      {!isVideoUpload?(
                      <TextField.Root
                            required
                            type="text"
                            name="supportLink"
                            onChange={(e) => {handleLinkChange(index,e)}}
                            placeholder="Enter Video Link"
                          />
                          ):
                          (
                            <input
                              required
                              type="file"
                              name="supportVideo"
                              accept="video/*"
                              onChange={(e) => handleFileChange(index, e)}
                              className="border border-[#484E54] px-[10px] py-[7px] rounded-full w-full"
                            />
                          )
                      }

                      
                      </Flex>
                    {exerciseList[index]["supportVideo"] && <Dialog.Close>
                        <Button>Save</Button>
                    </Dialog.Close>}
                </Dialog.Content>


      </Dialog.Root>
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-500 mt-5  cursor-pointer bg-transparent hover:text-red-700"
                    >
                      <MdDelete className="mt-3" size={26} color="red" />
                    </button>
                  </Box>
                </Stack>
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
                    <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
            <Box style={{ flex: 1 }}>
              <Label> Targeted Muscle Group</Label>

              <Select
                isMulti
                isDisabled
                value={workoutForm.targetedMuscleGroup}
                onChange={(selectedOptions) =>
                  handleMultiSelectChange(
                    "targetedMuscleGroup",
                    selectedOptions
                  )
                }
                options={targetedMuscleOptions}
                placeholder="Select Targeted Muscle Group"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor:  "#484E54",
                    boxShadow: state.isFocused ? "0 0 0 1px #6A4CE3" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#6A4CE3" : "#666",
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
            <Box style={{ flex: 1 }}>
              <Label> Equipments</Label>

              <Select
                isMulti
                value={workoutForm.equipments}
                onChange={(selectedOptions) =>
                  handleMultiSelectChange("equipments", selectedOptions)
                }
                options={gymEquipmentOptions}
                placeholder="Select Equipments"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor:  "#484E54",
                    boxShadow: state.isFocused ? "0 0 0 1px #6A4CE3" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#6A4CE3" : "#666",
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
          </Stack>

          <Stack
            direction={isMobile ? "column" : "row"}
            gap="4"
            style={{ width: "100%" }}
          >
          <Box style={{ flex: 1 }}>
    <Label htmlFor="difficultyLevel">Difficulty Level</Label>
    <Select
    isDisabled
      name="difficultyLevel"
      value={
        workoutForm.difficultyLevel
          ? {
              label: workoutForm.difficultyLevel,
              value: workoutForm.difficultyLevel,
            }
          : null
      }
      onChange={(selectedOption) =>
        setWorkoutForm((prev) => ({
          ...prev,
          difficultyLevel: selectedOption.value, // Store only the value (string)
        }))
      }
      options={[
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
      ]}
      placeholder="Select Difficulty Level"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
          borderColor:  "#484E54",
          boxShadow: state.isFocused ? "0 0 0 1px #6A4CE3" : "none",
          "&:hover": {
            borderColor: state.isFocused ? "#6A4CE3" : "#666",
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
         <Label htmlFor="benefits"> Benefits
         </Label>
              
              <TextField.Root
              readOnly
                type="text"
                name="benefits"
                value={workoutForm.benefits}
                onChange={handleInputChange}
                placeholder="Benefits"
              />
            </Box>
          </Stack>

          <Stack
      direction={isMobile ? "column" : "row"}
      gap="4"
      style={{ width: "100%" }}
    >
        <Box style={{ flex: 1 }}>
        <Label > Author </Label>
      
              
              {/* <Select
                value={workoutForm.author}
                onChange={(selectedOption) =>
                  handleSelectChange("author", selectedOption)
                }
                options={authorOptions}
                placeholder="Select Author"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                    borderColor: state.isFocused ? "#6A4CE3" : "#444",
                    boxShadow: state.isFocused ? "0 0 0 1px #6A4CE3" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#6A4CE3" : "#666",
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
              /> */}

                <TextField.Root
              required
                type="text"
                name="author"
                value={currentUser?currentUser:""}
                onChange={handleInputChange}
                placeholder="Author"
                readOnly
              />
            </Box>
            <Box style={{ flex: 1 }}>
  <Label htmlFor="visibility" isRequired>
    Visibility Status
  </Label>
  <Select
    isDisabled
    name="visibility"
    options={visibilityStatusOptions}
    value={
      workoutForm.visibility
        ? {
            label: workoutForm.visibility,
            value: workoutForm.visibility,
          }
        : null
    }
    onChange={(selectedOption) =>
      setWorkoutForm((prev) => ({
        ...prev,
        visibility: selectedOption.value,
      }))
    }
    styles={{
      control: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
        borderColor:  "#484E54",
        boxShadow: state.isFocused ? "0 0 0 1px #6A4CE3" : "none",
        "&:hover": {
          borderColor: state.isFocused ? "#6A4CE3" : "#666",
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

          <Stack
      direction={isMobile ? "column" : "row"}
      gap="4"
      style={{ width: "100%" }}
    >
         <Box style={{ flex: 1 }}>
         <Label htmlFor="creationDate">Creation Date</Label>
            
              
              <input
              readOnly
                type="date"
                name="creationDate"
                value={workoutForm.creationDate}
                onChange={handleInputChange}
                placeholder="Creation Date"
                className="border border-[#484E54] px-[1px] py-[7px] rounded-md w-full"
              />
            
            </Box>
            <Box style={{ flex: 1 }}>
            <Label htmlFor="overallRating" > Overall Rating (Out of 5)</Label>
              <TextField.Root
              readOnly
                type="number"
                name="overallRating"
                value={workoutForm.overallRating}
                onChange={handleInputChange}
                placeholder="Overall Rating"
              />
        
            </Box>
          </Stack>
                    <button type='submit' className='px-7 cursor-pointer hover:scale-105 text-lg font-semibold py-2 bg-transparent border rounded-lg border-blue-900'>Update</button>
                </form>
            </div>
        </>
    );
};

export const Component = EditWorkout;