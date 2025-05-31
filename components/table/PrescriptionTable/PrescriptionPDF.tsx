import { Button, Tooltip, Popconfirm } from "antd";
import { BsPrinterFill } from "react-icons/bs";

function PrescriptionPDF() {
  return (
    <Tooltip title="Export to PDF">
      <Button icon={<BsPrinterFill />

      } style={{
        width: 30,
        border: "none",
        fontSize: "20px",
        backgroundColor: "transparent",
      }}>
      </Button>
    </Tooltip>
  )
}
export default PrescriptionPDF;