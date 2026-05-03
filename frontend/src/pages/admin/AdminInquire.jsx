import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

const Inquire = () => {
  const [contactInquiries, setContactInquiries] = useState([]);
  const [newsletterInquiries, setNewsletterInquiries] = useState([]);
  // Pagination state
  const [contactPage, setContactPage] = useState(1);
  const [newsletterPage, setNewsletterPage] = useState(1);
  const PAGE_SIZE = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api("/inquire/all");
        setContactInquiries(res.contact_inquiries || []);
        setNewsletterInquiries(res.newsletter_inquiries || []);
      } catch (err) {
        setError("Failed to fetch inquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  // Pagination logic
  const contactTotalPages = Math.ceil(contactInquiries.length / PAGE_SIZE) || 1;
  const newsletterTotalPages = Math.ceil(newsletterInquiries.length / PAGE_SIZE) || 1;
  const pagedContact = contactInquiries.slice((contactPage - 1) * PAGE_SIZE, contactPage * PAGE_SIZE);
  const pagedNewsletter = newsletterInquiries.slice((newsletterPage - 1) * PAGE_SIZE, newsletterPage * PAGE_SIZE);

  // Pagination button component
  function Pagination({ page, setPage, totalPages }) {
    return (
      <div className="flex gap-2 items-center justify-center mt-3">
        <button
          className="px-3 py-1 rounded bg-[#e8f5ff] text-[#5b3df6] font-semibold disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="text-sm text-[#0f172a] font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-[#e8f5ff] text-[#5b3df6] font-semibold disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="border border-black/[0.08] border-solid flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex flex-col gap-[11px] items-start relative shrink-0">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[#4b2e00] text-[12px] font-medium">Inquiries Overview</div>
            </div>
            <div className="text-[24px] font-bold text-[#0f172a] sm:text-[28px]">
              View all contact and newsletter inquiries submitted by users.
            </div>
            <div className="text-[14px] text-[#94a3b8]">
              Manage and review all incoming messages and subscriptions from your platform.
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-[24px] w-full">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px] w-full">
            <div className="flex flex-col items-start justify-between gap-3 w-full lg:flex-row lg:items-center">
              <div className="flex flex-col gap-[4px] items-start">
                <div className="font-bold text-[18px] text-[#0f172a]">Contact Inquiries</div>
                <div className="text-[13px] text-[#94a3b8]">All messages submitted via the contact form</div>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm border border-black/[0.08] rounded-lg overflow-hidden">
                <thead className="bg-[#f7efeb] text-[#0f172a]">
                  <tr>
                    <th className="p-2 font-semibold">Full Name</th>
                    <th className="p-2 font-semibold">Email</th>
                    <th className="p-2 font-semibold">Phone</th>
                    <th className="p-2 font-semibold">School Name</th>
                    <th className="p-2 font-semibold">Class</th>
                    <th className="p-2 font-semibold">Subject</th>
                    <th className="p-2 font-semibold">Board</th>
                    <th className="p-2 font-semibold">Address</th>
                    <th className="p-2 font-semibold">Pincode</th>
                    <th className="p-2 font-semibold">Parents Mobile</th>
                    <th className="p-2 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={11} className="text-center py-4">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={11} className="text-center text-red-500 py-4">{error}</td></tr>
                  ) : contactInquiries.length === 0 ? (
                    <tr><td colSpan={11} className="text-center py-4">No contact inquiries found.</td></tr>
                  ) : (
                    pagedContact.map((inq) => (
                      <tr key={inq._id} className="border-t border-black/[0.06]">
                        <td className="p-2">{inq.fullName}</td>
                        <td className="p-2">{inq.email}</td>
                        <td className="p-2">{inq.phone}</td>
                        <td className="p-2">{inq.schoolName}</td>
                        <td className="p-2">{inq.class}</td>
                        <td className="p-2">{inq.subject}</td>
                        <td className="p-2">{inq.board}</td>
                        <td className="p-2">{inq.address}</td>
                        <td className="p-2">{inq.pincode}</td>
                        <td className="p-2">{inq.parentsMobile}</td>
                        <td className="p-2">{inq.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination for Contact Inquiries */}
              {contactInquiries.length > PAGE_SIZE && (
                <Pagination page={contactPage} setPage={setContactPage} totalPages={contactTotalPages} />
              )}
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px] w-full">
            <div className="flex flex-col items-start justify-between gap-3 w-full lg:flex-row lg:items-center">
              <div className="flex flex-col gap-[4px] items-start">
                <div className="font-bold text-[18px] text-[#0f172a]">Newsletter Subscriptions</div>
                <div className="text-[13px] text-[#94a3b8]">All newsletter signups from the homepage</div>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="min-w-[400px] w-full text-sm border border-black/[0.08] rounded-lg overflow-hidden">
                <thead className="bg-[#f7efeb] text-[#0f172a]">
                  <tr>
                    <th className="p-2 font-semibold">Email</th>
                    <th className="p-2 font-semibold">Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={2} className="text-center py-4">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={2} className="text-center text-red-500 py-4">{error}</td></tr>
                  ) : newsletterInquiries.length === 0 ? (
                    <tr><td colSpan={2} className="text-center py-4">No newsletter subscriptions found.</td></tr>
                  ) : (
                    pagedNewsletter.map((sub) => (
                      <tr key={sub._id} className="border-t border-black/[0.06]">
                        <td className="p-2">{sub.email}</td>
                        <td className="p-2">{sub.created_at ? new Date(sub.created_at).toLocaleString() : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination for Newsletter Subscriptions */}
              {newsletterInquiries.length > PAGE_SIZE && (
                <Pagination page={newsletterPage} setPage={setNewsletterPage} totalPages={newsletterTotalPages} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquire;
