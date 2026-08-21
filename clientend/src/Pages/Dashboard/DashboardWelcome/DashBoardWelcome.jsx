import LoadingCom from "../../../Components/Loading/LoadingCom";
import useSingleUserData from "./../../../hooks/useSingleUserData";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const DashBoardWelcome = () => {
  const [userInfo, isUserLoading, refetch] = useSingleUserData();
  const { user, verifyEmail } = useAuth();

  if (isUserLoading) {
    return <LoadingCom />
  }

  const handleResendVerification = () => {
    verifyEmail()
      .then(() => {
        Swal.fire({ icon: "success", title: "পাঠানো হয়েছে", text: "আবার একটা verification link ইমেইলে পাঠানো হয়েছে।" });
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: "সমস্যা হয়েছে", text: err.message });
      });
  };

  return (
    <div className="grid min-w-[calc(100vw-290px)] mx-auto items-center place-items-center md:grid-cols-2   gap-5">
      {user && !user.emailVerified && (
        <div className="col-span-full w-full bg-amber-50 border border-amber-300 text-amber-800 text-sm px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
          <span>⚠️ আপনার ইমেইল এখনো verify করা হয়নি। ইমেইলে পাঠানো লিংকে ক্লিক করুন।</span>
          <button onClick={handleResendVerification} className="underline font-semibold whitespace-nowrap">
            আবার পাঠান
          </button>
        </div>
      )}
      <div>
        <h2 className="text-4xl py-10  font-bold text-[#7A1128] p-5">
          Welcome! to Blood donation
        </h2>{" "}
      </div>
      <div className="p-10 md:flex flex-col-reverse items-center gap-15  justify-end">
        <div>
          <h2 className="text-2xl mb-0">{userInfo?.name}</h2>
          <h2 className="text-2xl mb-5">Role: {userInfo?.role}</h2>
        </div>
        <img
          className="w-36 h-36 rounded-3xl"
          src={userInfo?.profileImg}
          alt=""
        />
      </div>
    </div>
  );
};

export default DashBoardWelcome;
