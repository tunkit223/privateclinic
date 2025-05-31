import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { IPrescription } from '@/database/prescription.model';
import path from 'path';

Font.register({
  family: 'Roboto',
  src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'),
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto' },
  section: { marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10 },
  label: { fontWeight: "bold" },
});

export const PrescriptionDocument = ({ prescription }: { prescription: IPrescription }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Prescription Details</Text>
      <View style={styles.section}>
        <Text><Text style={styles.label}>Code:</Text> {prescription.code}</Text>
        <Text><Text style={styles.label}>Patient:</Text> {prescription.medicalReportId?.appointmentId?.patientId?.name || "N/A"}</Text>
        <Text><Text style={styles.label}>Doctor:</Text> {prescription.prescribeByDoctor?.name || "N/A"}</Text>
        <Text><Text style={styles.label}>Total Price:</Text> ${prescription.totalPrice}</Text>
        <Text><Text style={styles.label}>Status:</Text> {prescription.isPaid ? "Paid" : "Unpaid"}</Text>
      </View>
    </Page>
  </Document>
);