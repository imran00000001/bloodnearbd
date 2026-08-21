import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingCom from "../../../Components/Loading/LoadingCom";
import Swal from "sweetalert2";

const Reports = () => {
  const axiosSecure = useAxiosSecure();

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports", {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
  });

  const handleMarkReviewed = async (id) => {
    await axiosSecure.patch(
      `/reports/${id}`,
      {},
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    Swal.fire({ icon: "success", title: "Marked as reviewed", timer: 1200, showConfirmButton: false });
    refetch();
  };

  if (isLoading) return <LoadingCom />;

  return (
    <div className="p-6">
      <h2 className="font-display text-3xl text-wine mb-6">Donor Reports</h2>

      {reports.length === 0 && <p className="text-gray-500">এখনো কোনো রিপোর্ট জমা হয়নি।</p>}

      <div className="grid gap-4">
        {reports.map((r) => (
          <div key={r._id} className="border rounded-lg p-4 flex gap-4 items-start bg-white shadow-sm">
            {r.photoUrl && (
              <img src={r.photoUrl} alt="proof" className="w-28 h-28 object-cover rounded-md flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                রিপোর্টকারী: <b>{r.reporterName}</b> ({r.reporterEmail})
              </p>
              <p className="text-sm text-gray-500">
                অভিযুক্ত ডোনার: <b>{r.donorName || r.donorEmail}</b> ({r.donorEmail})
              </p>
              <p className="mt-2">{r.reason}</p>
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                  r.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                }`}
              >
                {r.status}
              </span>
            </div>
            {r.status === "pending" && (
              <button
                onClick={() => handleMarkReviewed(r._id)}
                className="bg-[#7A1128] text-white px-3 py-2 rounded-md text-sm self-start"
              >
                Reviewed করুন
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
