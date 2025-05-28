
import { useRouter, useParams } from "next/navigation";
import { Button } from "antd";
import { FaPen } from "react-icons/fa";

function EditButton({ id }: { id: string }) {
  const router = useRouter();
  const params = useParams();


  const handleEdit = () => {
    const accountId = params?.accountId;
    router.push(`/${accountId}/prescription/${id}/edit`);
  }
  return (
    <Button onClick={handleEdit} icon={<FaPen />

    } style={{
      width: 30,
      border: "none",
      fontSize: "20px",

      backgroundColor: "transparent",
    }}>
    </Button>
  )
}
export default EditButton;