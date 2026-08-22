import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

// এই ব্যানারটা পুরো সাইটের সব পেইজেই (landing + dashboard) দেখাবে,
// যতক্ষণ পর্যন্ত ইউজার email verify না করবে।
const VerifyEmailBanner = () => {
  const { user, verifyEmail } = useAuth();

  if (!user || user.emailVerified) return null;

  const handleResendVerification = () => {
    verifyEmail()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "পাঠানো হয়েছে",
          text: "আবার একটা verification link ইমেইলে পাঠানো হয়েছে।",
        });
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: "সমস্যা হয়েছে", text: err.message });
      });
  };

  return (
    <div className="w-full bg-amber-50 border border-amber-300 text-amber-800 text-sm px-4 py-3 flex flex-wrap items-center justify-center gap-2 sticky top-0 z-50">
      <span>⚠️ আপনার ইমেইল এখনো verify করা হয়নি। ইমেইলে পাঠানো লিংকে ক্লিক করুন।</span>
      <button onClick={handleResendVerification} className="underline font-semibold whitespace-nowrap">
        আবার পাঠান
      </button>
    </div>
  );
};

export default VerifyEmailBanner;
