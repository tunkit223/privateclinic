"use client"
import { Button, Tooltip } from 'antd';
import { RiPrinterFill } from 'react-icons/ri';

interface DownloadPDFButtonProps {
  prescriptionId: string;
}

const DownloadPDFButton = ({ prescriptionId }: DownloadPDFButtonProps) => {
  const downloadPDF = async () => {
    const res = await fetch(`/api/prescription/${prescriptionId}/pdf`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${prescriptionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tooltip title="Export to PDF">
      <Button
        style={{
          width: 30,
          border: "none",
          fontSize: "20px",
          backgroundColor: "transparent",
        }}
        icon={<RiPrinterFill />}
        onClick={downloadPDF}
      />
    </Tooltip>
  );
};

export default DownloadPDFButton;