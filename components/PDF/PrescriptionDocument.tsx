import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { IPrescription } from '@/database/prescription.model';
import path from 'path';
import { IPrescriptionDetail } from '@/database/prescriptionDetail.model';
import { IPrescriptionDetailPopulated } from '@/lib/interfaces/prescriptionPopulated.interface';
import dayjs from 'dayjs';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf'), fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 13 },
  divHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  displayFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  section: { marginBottom: 10 },
  title: { fontSize: 25, marginBottom: 10, fontWeight: "bold" },
  titlePrescription: { fontSize: 28, fontWeight: "bold" },
  label: { fontWeight: "bold" },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    marginBottom: 4,
    paddingBottom: 2
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  col1: { width: '5%' },
  col2: { width: '27%' },
  col3: { width: '7%' },
  col4: { width: '7%' },
  col5: { width: '7%' },
  col6: { width: '7%' },
  col7: { width: '7%' },
  col8: { width: '7%' },
  col9: { width: '26%' },
});

export const PrescriptionDocument = ({ prescription, details }: {
  prescription: IPrescription;
  details: IPrescriptionDetailPopulated[]
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.divHeader}>
        <Text style={styles.title}>Private Clinic Three-K</Text>
        <Text>Address: Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City.</Text>
        <Text>Phone:(028) 372 52002</Text>
      </View>
      <View style={styles.divHeader}>
        <Text style={styles.titlePrescription}>Prescription</Text>
        <Text style={styles.label}>
          <Text>Code: </Text>
          <Text>{prescription.code || "N/A"}</Text>
        </Text>
      </View>
      {/* End Header  */}
      <View style={styles.section}>
        <View style={styles.displayFlex} >
          <Text>
            <Text >Patient name: </Text>
            <Text style={styles.label}>{prescription.medicalReportId?.appointmentId?.patientId?.name.toUpperCase() || "N/A"}</Text>
          </Text>
          <View style={styles.displayFlex}>
            <Text>
              <Text>Birthdate: </Text>
              <Text>{prescription.medicalReportId?.appointmentId?.patientId.birthdate ?
                dayjs(prescription.medicalReportId?.appointmentId?.patientId.birthdate).format("DD/MM/YYYY") : 'N/A'},</Text>
            </Text>
            <Text style={{ marginLeft: 5 }}>
              <Text>gender: </Text>
              <Text>{prescription.medicalReportId?.appointmentId.patientId.gender || "N/A"}</Text>
            </Text>
          </View>

        </View>
        <Text >
          <Text>Phone: </Text>
          <Text>{prescription.medicalReportId?.appointmentId.patientId.phone || "N/A"}</Text>
        </Text>
        <Text >
          <Text>Address: </Text>
          <Text>{prescription.medicalReportId?.appointmentId.patientId.address || "N/A"}</Text>
        </Text>
      </View>
      <Text style={{ ...styles.label, marginBottom: 5 }}>Medicine List</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.col1}>#</Text>
        <Text style={styles.col2}>Medicine</Text>
        <Text style={styles.col3}>Morn</Text>
        <Text style={styles.col4}>Noon</Text>
        <Text style={styles.col5}>Aft</Text>
        <Text style={styles.col6}>Eve</Text>
        <Text style={styles.col7}>Qty</Text>
        <Text style={styles.col8}>Unit</Text>
        <Text style={styles.col9}>Usage</Text>
      </View>
      {details.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.col1}>{index + 1}</Text>
          <Text style={styles.col2}>{item.medicineId?.name || 'N/A'}</Text>
          <Text style={styles.col3}>{item.morningDosage || '0'}</Text>
          <Text style={styles.col4}>{item.noonDosage || '0'}</Text>
          <Text style={styles.col5}>{item.afternoonDosage || '0'}</Text>
          <Text style={styles.col6}>{item.eveningDosage || '0'}</Text>
          <Text style={styles.col7}>{item.quantity}</Text>
          <Text style={styles.col8}>Pill</Text>
          <Text style={styles.col9}>{item.usageMethodId?.name || 'N/A'}</Text>
        </View>
      ))}
      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>Doctor's instructions: </Text>
        <Text>Hen ngay tai kham</Text>
      </View>
      <View style={{ marginTop: 50 }}>
        <View style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: 70
        }}>
          <Text>
            {prescription.createdAt ?
              dayjs(prescription.createdAt).format("DD/MM/YYYY") : 'N/A'}
          </Text>
        </View>
        <View style={styles.displayFlex}>
          <Text style={{ marginLeft: 40 }}>Prescribing pharmacist</Text>
          <Text style={{ marginRight: 60 }}>Treating doctor</Text>
        </View>
      </View>
      {/* <View style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 70,
        marginTop: 50
      }} >
        <View style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text>
            {prescription.createdAt ?
              dayjs(prescription.createdAt).format("DD/MM/YYYY") : 'N/A'}
          </Text>
          <Text>Treating doctor</Text>
        </View>
        <Text>Prescribing pharmacist</Text>
      </View> */}
    </Page>
  </Document>
);