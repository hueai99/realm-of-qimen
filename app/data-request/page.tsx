import Link from "next/link";

export const metadata = { title: "Personal Data Request | Realm of Qimen" };

export default function DataRequestPage(){
  const subject=encodeURIComponent("Personal data request");
  const body=encodeURIComponent("Please state whether you are requesting access, correction, withdrawal of consent, or deletion.\n\nParent name:\nEmail used for the report:\nChild name:\nApproximate report date:\nRequest:\n");
  return <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16"><Link href="/" className="text-sm font-semibold tracking-wide">REALM OF QIMEN</Link><p className="mt-12 text-xs font-bold uppercase tracking-[.22em] text-[#007789]">Privacy</p><h1 className="mt-2 text-5xl">Personal data request</h1><div className="mt-8 space-y-5 leading-8 text-[#272727]"><p>You may request access to or correction of personal information, withdraw consent, or ask us to delete information connected with a report.</p><p>To help us locate the correct record and protect it from unauthorised requests, email us from the parent email address used for the report. Include the parent&apos;s name, child&apos;s name, and approximate report date. We may ask for reasonable information to verify the request.</p><p>Deletion may prevent the report from being retrieved. We may retain limited information where required for legal, security, dispute-resolution, or legitimate record-keeping purposes.</p></div><a href={`mailto:realmofqimen@gmail.com?subject=${subject}&body=${body}`} className="mt-8 inline-block bg-[#007789] px-6 py-4 font-semibold text-white">Email a data request</a><p className="mt-6 text-sm text-[#4e5b6f]">If the button does not open your email app, write to realmofqimen@gmail.com with the subject “Personal data request”.</p></main>;
}
