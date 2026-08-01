"use client";
import Link from "next/link";
import { useMemo,useState } from "react";

type Chart={day_master?:string;day_master_name?:string;day_master_strength?:string;strength?:string};
export type LeadDeskRow={id:string;name:string;parent_name:string|null;email:string;phone:string|null;report_id:string;conversion_status:string;notes:string|null;created_at:string;report:{id:string;subject_name:string;birth_date:string;birth_time:string|null;birth_place:string|null;gender:string|null;question_type:string|null;chart_data:Chart|null;chart_status:string|null;report_content:unknown}|null;feedback:{rating:string;comment:string;interested_in_more:boolean}|null};
const ratings:Record<string,string>={very_close:"Very closely",partly:"Some parts felt right",not_accurate:"Did not feel accurate",unsure:"Not sure yet"};
const title=(s?:string|null)=>s?s.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase()):"—";

export default function LeadsTable({initial}:{initial:LeadDeskRow[]}){
 const [leads,setLeads]=useState(initial);
 const stats=useMemo(()=>({total:leads.length,interested:leads.filter(x=>x.feedback?.interested_in_more).length,contacted:leads.filter(x=>x.conversion_status==="contacted").length,paid:leads.filter(x=>x.conversion_status==="paid").length}),[leads]);
 async function save(id:string,patch:Partial<LeadDeskRow>){setLeads(v=>v.map(x=>x.id===id?{...x,...patch}:x));const r=await fetch(`/api/admin/leads/${id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify(patch)});if(!r.ok)location.reload()}
 return <main className="mx-auto max-w-[1600px] p-4 py-8 sm:p-6 sm:py-10">
  <p className="text-xs uppercase tracking-widest text-[#9b3c2b]">Realm of Qimen</p><h1 className="mt-2 text-4xl">Lead and report review</h1><p className="mt-3 text-[#665a50]">Contact details, birth information, Bazi results and feedback in one place.</p>
  <div className="my-8 grid gap-px bg-[#cfc2b4] sm:grid-cols-4">{[["Total",stats.total],["Interested in more",stats.interested],["Contacted",stats.contacted],["Paid",stats.paid]].map(([k,v])=><div key={k} className="bg-[#fffaf0] p-5"><p className="text-xs uppercase tracking-widest text-[#877b70]">{k}</p><p className="mt-2 text-3xl">{v}</p></div>)}</div>
  {!leads.length?<p>No leads yet—share the summary link to get started.</p>:<div className="overflow-x-auto border border-[#cfc2b4] bg-[#fffaf0]"><table className="w-full min-w-[1500px] border-collapse text-left text-sm"><thead className="bg-[#211b16] text-white"><tr>{["Parent and contact","Child","Birth details","Day Master","Feedback","Lead follow-up","Created","Generated report"].map(h=><th key={h} className="p-3 font-normal">{h}</th>)}</tr></thead><tbody>{leads.map(l=><LeadRow key={l.id} lead={l} save={save}/>)}</tbody></table></div>}
 </main>
}

function LeadRow({lead:l,save}:{lead:LeadDeskRow;save:(id:string,p:Partial<LeadDeskRow>)=>void}){
 const c=l.report?.chart_data;const dm=[c?.day_master,c?.day_master_name].filter(Boolean).join(" · ");
 return <tr className="border-t border-[#ded4c8] align-top">
  <td className="p-3"><b>{l.parent_name??l.name}</b><a className="mt-1 block underline" href={`mailto:${l.email}`}>{l.email}</a><p className="mt-1 text-[#665a50]">{l.phone??"No mobile number"}</p></td>
  <td className="p-3"><b>{l.report?.subject_name??"—"}</b><p className="mt-1 text-[#665a50]">{title(l.report?.gender)}</p></td>
  <td className="p-3"><p>{l.report?.birth_date??"—"}{l.report?.birth_time?` at ${l.report.birth_time.slice(0,5)}`:""}</p><p className="mt-1 text-[#665a50]">{l.report?.birth_place??"Birthplace not recorded"}</p></td>
  <td className="p-3"><b>{dm||"—"}</b><p className="mt-1 text-[#665a50]">{c?.day_master_strength??c?.strength??"Strength not recorded"}</p><p className="mt-1 text-xs uppercase tracking-wide text-[#877b70]">{title(l.report?.chart_status)}</p></td>
  <td className="max-w-xs p-3">{l.feedback?<><b>{ratings[l.feedback.rating]??"No rating"}</b>{l.feedback.comment&&<p className="mt-1 text-[#665a50]">“{l.feedback.comment}”</p>}{l.feedback.interested_in_more&&<p className="mt-2 font-semibold text-[#9b3c2b]">Interested in learning more</p>}</>:<span className="text-[#877b70]">No feedback yet</span>}</td>
  <td className="p-3"><select value={l.conversion_status} onChange={e=>save(l.id,{conversion_status:e.target.value})} className="border bg-white p-2"><option value="new">New</option><option value="contacted">Contacted</option><option value="paid">Paid</option></select><textarea defaultValue={l.notes??""} onBlur={e=>save(l.id,{notes:e.target.value})} className="mt-2 block h-20 w-56 border bg-white p-2" placeholder="Follow-up notes"/></td>
  <td className="whitespace-nowrap p-3">{new Date(l.created_at).toLocaleDateString("en-SG")}</td>
  <td className="p-3">{l.report?.report_content?<Link className="inline-block bg-[#9b3c2b] px-4 py-2 text-white" href={`/report/${l.report_id}`} target="_blank">Open report</Link>:<span className="text-[#877b70]">Not generated</span>}</td>
 </tr>
}
