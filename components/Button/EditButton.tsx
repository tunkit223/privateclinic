
import { useRouter, useParams } from "next/navigation";
import { Button, Tooltip } from "antd";
import { FaPen } from "react-icons/fa";

function EditButton({ id, resource }: { id: string; resource: string }) {
  const router = useRouter();
  const params = useParams();
  const handleEdit = () => {
    const accountId = params?.accountId;
    router.push(`/${accountId}/${resource}/${id}/edit`);
  }
  return (
    <Tooltip title="Edit" >
      <Button onClick={handleEdit} icon={<FaPen />
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
export default EditButton;