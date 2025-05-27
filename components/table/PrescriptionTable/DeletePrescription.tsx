import { Button } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";

const DeletePrescriptionDetails = () => {

  return (
    <>
      <Button icon={<RiDeleteBin6Line />
      } style={{
        width: 30,
        border: "none",
        fontSize: "20px",
        backgroundColor: "transparent",
      }}>
      </Button>
    </>
  )
}
export default DeletePrescriptionDetails;