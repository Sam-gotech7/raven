import { useState ,useContext, useEffect} from "react";
import { Flex, Text, Card, Box, Button } from "@radix-ui/themes";
import { useIsDesktop, useIsMobile } from "@/hooks/useMediaQuery";
import { useTheme } from "@/ThemeProvider";
import { useFrappeUpdateDoc, FrappeConfig, FrappeContext,useFrappeAuth,useFrappeGetDoc  } from "frappe-react-sdk"
import { toast } from 'sonner'

export const PersonalDetails = () => {
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
        .then((doc) => console.log(doc))
        .catch((error) => console.error(error));
     };

     if (!profileDta) {
      return <p>Loading...</p>;
    }
  const experienceLevelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Expert", label: "Expert" },
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
              
          
              <Box>
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  style={{
                    width: "98%",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
                  }}
                />
              </Box>

            
              <Box>
                <label htmlFor="yearsOfExperience">Years of Experience</label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="Enter years of experience"
                  style={{
                    width: "98%",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
                  }}
                />
              </Box>

              {/* Biography/Description */}
              <Box>
                <label htmlFor="biography">Biography/Description</label>
                <textarea
                  id="biography"
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  rows={5}
                  placeholder="Enter a short biography or description"
                  style={{
                    width: "98%",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
                  }}
                />
              </Box>

              {/* Specialization (as textarea) */}
              <Box>
                <label htmlFor="specialization">Specialization</label>
                <textarea
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  rows={5}
                  placeholder="Enter your specialization"
                  style={{
                    width: "98%",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
                  }}
                />
              </Box>

              {/* Qualifications/Certifications */}
              <Box>
                <label htmlFor="qualifications">Qualifications/Certifications</label>
                <textarea
                  id="qualifications"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  rows={5}
                  placeholder="Enter your qualifications or certifications"
                  style={{
                    width: "98%",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
                  }}
                />
              </Box>

              {/* Certification/License Number */}
              <Box>
                <label htmlFor="licenseNumber">Certification/License Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="Enter your certification/license number"
                  style={{
                    width: "98%",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
                  }}
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
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: appearance === "dark" ? "#333" : "#fff",
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
