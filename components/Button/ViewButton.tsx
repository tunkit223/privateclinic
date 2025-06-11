import { Tooltip, Button } from "antd"
import { GrView } from "react-icons/gr";
import { useRouter, useParams } from "next/navigation";

function ViewButton({ id, resource }: { id: string; resource: string }) {
  const router = useRouter();
  const params = useParams();
  const handleView = () => {
    const accountId = params?.accountId;
    router.push(`/${accountId}/${resource}/${id}/view`);
  }
  return (
    <Tooltip title="View detail">
      <Button onClick={handleView} icon={<GrView />
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
export default ViewButton;