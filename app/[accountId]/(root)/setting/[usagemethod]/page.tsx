"use client"
import { createUsageMethod } from "@/lib/actions/usageMethod.action";
import { Button, Form, Input } from "antd";

function UsageMethodPage() {
  const handleOnfinish = async (values: any) => {
    await createUsageMethod(values);
  }
  return (
    <>
      <Form onFinish={handleOnfinish} >
        <Form.Item name="name" label="Usage method" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default UsageMethodPage;