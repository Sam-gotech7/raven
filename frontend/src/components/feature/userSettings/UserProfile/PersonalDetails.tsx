import { useState ,useContext, useEffect} from "react";
import { Flex, Text, Card, Box, Button, TextField,TextArea} from "@radix-ui/themes";
import { Label, ErrorText, HelperText } from '@/components/common/Form'
import { Stack, HStack } from '@/components/layout/Stack'
import { useIsDesktop, useIsMobile } from "@/hooks/useMediaQuery";
import { useTheme } from "@/ThemeProvider";
import { useFrappeUpdateDoc, FrappeConfig, FrappeContext,useFrappeAuth,useFrappeGetDoc  } from "frappe-react-sdk"
import { toast } from 'sonner'
import * as Select from '@radix-ui/react-select';

export  const PersonalDetails = () => {
  const [instructorId, setInstructorId] = useState('');
  const { data: profileDta, error } = useFrappeGetDoc('Instructor', instructorId);
  const [mobileNumber, setMobileNumber] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [biography, setBiography] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
 

  const { call,db } = useContext(FrappeContext) as FrappeConfig;
  const { currentUser } = useFrappeAuth()
  const { appearance } = useTheme();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  
 console.log(currentUser, 'cur')

  const fetchInstructorId = async () => {
    if (!currentUser) {
      // Check if currentUser is available
      console.error('No currentUser found');
      return;
    }

    const updatedFields = {
      doctype: 'Instructor', // Fixing the single quote issue
      filters: [['linked_user', '=', currentUser]],
      fieldname: 'name'
    };

    try {
      const res = await call.post('frappe.client.get_value', updatedFields);
      setInstructorId(res?.message?.name)
      console.log(res);
    } catch (error) {
      console.error('Error fetching instructor ID:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {

      console.log(currentUser, 'ghsBSCJHsDJHGdSHdSkh')
      fetchInstructorId();
    }
  }, [currentUser]);

  useEffect(() => {
    if (profileDta) {
      setMobileNumber(profileDta.mobile_no || '');
      setYearsOfExperience(profileDta.yoe || '');
      setBiography(profileDta.biography || '');
      setSpecialization(profileDta.specialisation || '');
      setQualifications(profileDta.qualifications || '');
      setLicenseNumber(profileDta.license_number || '');
      setExperienceLevel(profileDta.experience_level || '');
    }
  }, [profileDta]);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    db.updateDoc('Instructor', instructorId, {
        mobile_no: mobileNumber,
        yoe: yearsOfExperience,
        biography: biography,
        specialisation: specialization,
        qualifications: qualifications,
        license_number:licenseNumber,
        experience_level:experienceLevel

      })
        .then((doc) => toast.success('Personal Details Updated Successfully'))
        .catch((error) => console.error(error));
     };

     if (!profileDta?.experience_level) {
      return <p>Loading...</p>;
    }
    const experienceLevelOptions = [
      { value: 'Beginner', label: 'Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Expert', label: 'Expert' },
    ];
  return (
    <Flex direction="column" gap="4" px={isMobile ? "4" : "6"} py="4" style={{ maxWidth: "100%" }}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center" direction={isMobile ? "column" : "row"}>
            <Flex direction="column" gap="0">
              <Text size="3" className="font-semibold">Personal Details</Text>
              <Text size="1" color="gray">Manage your Personal Details</Text>
            </Flex>
            <Button
              type="submit"
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : "200px", 
                marginTop: isMobile ? "16px" : "8px",
              }}
            >
              Save
            </Button>
          </Flex>

          
          <Card className="p-0 align-middle justify-center" style={{ width: isMobile ? '100%' : 'auto' }}>
            <Flex direction="column" gap="4" p="4">
              
            <Stack direction={isMobile ? 'column' : 'row'} gap="4" style={{ width: '100%' }}>
  {/* Mobile Number Field */}
  <Box style={{ flex: 1 }}>
    <Label htmlFor="mobileNumber" isRequired>Mobile Number</Label>
    <TextField.Root
      id="mobileNumber"
      value={mobileNumber}
      onChange={(e) => setMobileNumber(e.target.value)}
      placeholder="Enter your mobile number"
    />
  </Box>

  <Box style={{ flex: 1 }}>
    <Label htmlFor="yearsOfExperience" isRequired>Years of Experience</Label>
    <TextField.Root
      id="yearsOfExperience"
      type="number"
      value={yearsOfExperience}
      onChange={(e) => setYearsOfExperience(e.target.value)}
      placeholder="Enter years of experience"
    
    />
  </Box>
</Stack>
<Box>
<Label htmlFor="biography" isRequired>Biography/Description</Label>
    <TextArea
      id="biography"
      rows={5}
      value={biography}
      onChange={(e) => setYearsOfExperience(e.target.value)}
      placeholder="Enter a short biography or description"
    
    />
</Box>
              <Box>
              <Label htmlFor="specialization" isRequired>Specialization</Label>
                <TextArea
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  rows={5}
                  placeholder="Enter your specialization"
                />
              </Box>

              {/* Qualifications/Certifications */}
              <Box>
              <Label htmlFor="qualifications" isRequired>Qualifications/Certifications</Label>
                <TextArea
                  id="qualifications"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  rows={5}
                  placeholder="Enter your qualifications or certifications"
                />
              </Box>

              {/* Certification/License Number */}
              <Box>
              <Label htmlFor="licenseNumber" isRequired>Certification/License Number</Label>
                <TextField.Root
                  type="text"
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="Enter your certification/license number"
                />
              </Box>

              {/* Experience Level */}
              <Box>
                <label htmlFor="experienceLevel">Experience Level</label>
                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #4D545A",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#17191A" : "#fff",
                  }}
                >
                  <option value="">Select experience level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </Box>

            </Flex>
          </Card>
        </Flex>
      </form>
    </Flex>
  );
};
