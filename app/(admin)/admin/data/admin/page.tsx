import React from "react";
import { getAdminData } from "./actions";
import AdminTableClient from "./AdminTableClient";

export default async function DataAdminPage() {
  const admins = await getAdminData();

  return <AdminTableClient initialData={admins} />;
}
