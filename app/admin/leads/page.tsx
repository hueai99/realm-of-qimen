import { redirect } from "next/navigation"; import { isAdmin } from "@/lib/admin-auth"; import { createAdminClient } from "@/lib/supabase/admin"; import LeadsTable from "@/app/components/leads-table";
export const dynamic="force-dynamic";
export default async function LeadsPage(){if(!await isAdmin())redirect("/admin");const db=createAdminClient();const {data,error}=await db.from("leads").select("*, bazi_reports(question_type)").order("created_at",{ascending:false});if(error)return <main className="p-8">Could not load leads.</main>;return <LeadsTable initial={data??[]}/>}
