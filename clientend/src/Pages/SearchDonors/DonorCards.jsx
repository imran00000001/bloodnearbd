
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import Swal from "sweetalert2";
import ReportDonorModal from "../../Components/Report/ReportDonorModal";
import useAuth from "../../hooks/useAuth";
import usePublicAxios from "../../hooks/usePublicAxios";

const DonorCards = ({ data }) => {
    const { user } = useAuth();
    const axiosPublic = usePublicAxios();
    const [notifying, setNotifying] = useState(false);

    const handleNotify = async () => {
        setNotifying(true);
        try {
            await axiosPublic.post("/push/notify-donor", {
                donorEmail: data?.email,
                requesterName: user?.displayName,
                message: `${user?.displayName || "একজন"} আপনাকে রক্তের প্রয়োজনে খুঁজছেন।`,
            });
            Swal.fire({ icon: "success", title: "নোটিফিকেশন পাঠানো হয়েছে", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({
                icon: "warning",
                title: "পাঠানো যায়নি",
                text: err?.response?.data?.message || "এই ডোনার নোটিফিকেশন চালু রাখেননি, তাই সরাসরি Call/SMS করুন।",
            });
        }
        setNotifying(false);
    };

    return (
        <Card className="lg:w-64">
            <CardHeader floated={false} className="h-36 md:h-60">
                <img className="object-cover h-36 md:h-60 w-full" src={data?.profileImg} alt="profile-picture" />

            </CardHeader>
            <CardBody className="text-center">

                <Tooltip content="Like">
                    <Typography
                        as="a"

                        variant="lead"
                        color="red"


                        textGradient
                    >

                        {data?.blood}
                    </Typography>
                </Tooltip>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {data?.name}
                </Typography>
                <Typography color="blue-gray" className="font-medium" textGradient>
                    {data?.upuzilla},
                    {data?.districts}

                </Typography>
                <Typography color="blue-gray" className="font-medium mt-1">
                    📞 {data?.phone ? data.phone : "নাম্বার দেওয়া নেই"}
                </Typography>

                {data?.phone && (
                    <div className="flex justify-center gap-2 mt-2">
                        <a
                            href={`tel:${data.phone}`}
                            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md"
                        >
                            📞 Call
                        </a>
                        <a
                            href={`sms:${data.phone}`}
                            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md"
                        >
                            ✉ SMS
                        </a>
                    </div>
                )}

                <button
                    onClick={handleNotify}
                    disabled={notifying}
                    className="mt-2 bg-[#7A1128] text-white text-xs px-3 py-1.5 rounded-md w-full"
                >
                    🔔 {notifying ? "পাঠানো হচ্ছে..." : "Push Notification পাঠান"}
                </button>
            </CardBody>
            <CardFooter className="flex justify-center gap-2 pt-0">
                <ReportDonorModal donor={data} />
            </CardFooter>
        </Card>
    );
};

export default DonorCards;
