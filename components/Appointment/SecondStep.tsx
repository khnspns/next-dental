import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  SegmentedControl,
  Select,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconStethoscope, IconWheelchair } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { checkPatient, createAppointment } from "@/lib/api";
import { ReactPropTypes, useEffect } from "react";
import {
  DateInput,
  DatePicker,
  DateTimePicker,
  TimeInput,
} from "@mantine/dates";
import moment from "moment";
import { useDebouncedValue, useShallowEffect } from "@mantine/hooks";

const SecondStep = (props: any) => {
  const { readOnly, patientExists, setPatientExists, form } = props;
  const queryClient = useQueryClient();

  const [debounced] = useDebouncedValue(
    {
      patient: {
        firstname: form.values.patient.firstname,
        lastname: form.values.patient.lastname,
        dob: form.values.patient.dob,
      },
    },
    200
  );

  useShallowEffect(() => {
    const checkPatientExists = async () => {
      const { patient } = form.values;

      const { firstname, lastname, dob } = patient;

      if (firstname && lastname && dob) {
        const response = await checkPatient({
          firstname,
          lastname,
          dob,
        });

        console.log(response);

        if (response.message === "You already have a record in the database") {

          const { patient } = response;
          form.setFieldValue("patient.id", patient.id); 
          setPatientExists(true);
        } else if (response.message === "Patient does not exist") {
          form.setFieldValue("patient.id", ""); 
          setPatientExists(false);
        }

        
        console.log(patientExists);
      }
    };

    checkPatientExists();
  }, [
    debounced.patient.firstname,
    debounced.patient.lastname,
    debounced.patient.dob,
  ]);

  return (
    <form>
      <Title size={20} mt="md" weight={400}>
        Patient Details
      </Title>
      <Grid>
        <Grid.Col span={12} mt="md">
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="First Name"
              disabled={readOnly}
              {...form.getInputProps("patient.firstname")}
            />
            <TextInput
              label="Middle Name"
              placeholder="Middle Name"
              disabled={readOnly}
              {...form.getInputProps("patient.middlename")}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              disabled={readOnly}
              {...form.getInputProps("patient.lastname")}
            />
          </Group>

          <Group grow>
            <DateInput
              mt="md"
              clearable
              label="Date of Birth"
              placeholder="MM/DD/YYYY"
              {...form.getInputProps("patient.dob")}
            />
            
          </Group>

          {!patientExists && (
            <>
            <TextInput
              mt="md"
              label="Contact Number"
              placeholder="(+63) 912 345 6789"
              disabled={readOnly}
              {...form.getInputProps("patient.mobile_no")}
            />
              <TextInput
                mt="md"
                label="Address"
                placeholder="Street, Barangay, City, Province"
                disabled={readOnly}
                {...form.getInputProps("patient.address")}
              />
              <Group grow>
                <TextInput
                  mt="md"
                  label="Age"
                  placeholder="Age"
                  disabled={readOnly}
                  {...form.getInputProps("patient.age")}
                />
                <Select
                  mt="md"
                  label="Sex"
                  placeholder="Pick one"
                  data={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  {...form.getInputProps("patient.sex")}
                ></Select>
                <Select
                  mt="md"
                  label="Civil Status"
                  placeholder="Pick one"
                  data={[
                    { value: "single", label: "Single" },
                    { value: "married", label: "Married" },
                    { value: "widowed", label: "Widowed" },
                    { value: "separated", label: "Separated" },
                    { value: "divorced", label: "Divorced" },
                  ]}
                  {...form.getInputProps("patient.civil_status")}
                ></Select>
              </Group>
              <Title size={20} mt="md" weight={400}>
                Emergency Details
              </Title>
              <Group grow>
                <TextInput
                  mt="md"
                  label="Emergency Contact Name"
                  placeholder="John Doe"
                  disabled={readOnly}
                  {...form.getInputProps("patient.emergency_contact")}
                />
                <TextInput
                  mt="md"
                  label="Emergency Contact Number"
                  placeholder="(+63) 912 345 6789"
                  disabled={readOnly}
                  {...form.getInputProps("patient.emergency_mobile_no")}
                />
              </Group>
              <Textarea
                mt="md"
                label="Medical History"
                placeholder="sickness, allergies, etc."
                {...form.getInputProps("patient.medical_history")}
              ></Textarea>
            </>
          )}

        </Grid.Col>
      </Grid>
    </form>
  );
};

export default SecondStep;
