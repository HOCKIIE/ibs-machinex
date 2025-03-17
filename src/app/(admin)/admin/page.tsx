import { Metadata  } from "next";
import AdminLayout from "@/components/admin/layout/DefaultLayout";
import Dashboard from '@/components/admin/Dashboard/Dashboard';


export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

const AdminPage = () => {
    return <AdminLayout><Dashboard/></AdminLayout>
}

export default AdminPage