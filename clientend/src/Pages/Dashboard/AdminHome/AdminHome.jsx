
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import useStaticsReport from "../../../hooks/useStaticsReport";
import useAdmin from "../../../hooks/useAdmin";
import { RiFundsFill, RiUserAddFill } from "react-icons/ri";
import { VolunteerActivismTwoTone, Article, People, Report, BloodtypeSharp, AccountBalanceWallet } from "@mui/icons-material";
import { Link } from "react-router-dom";
import LoadingCom from "../../../Components/Loading/LoadingCom";

// Quick-access links into the management sections. Shown to every admin
// right on their landing page so they can jump straight into management
// instead of hunting through the sidebar first.
const MANAGEMENT_LINKS = [
  { to: "/dashboard/content-management", label: "Content Management (Blog)", icon: Article },
  { to: "/dashboard/all-users", label: "User Management", icon: People },
  { to: "/dashboard/all-donation-request", label: "Donation Requests", icon: BloodtypeSharp },
  { to: "/dashboard/reports", label: "Donor Reports", icon: Report },
  { to: "/dashboard/admin/allFundHistory", label: "Fund History", icon: AccountBalanceWallet },
];

const AdminHome = () => {
  const { statictisData, isstatictisDataLoading } = useStaticsReport()
  const [isAdmin] = useAdmin();

  if (isstatictisDataLoading) {
    return <LoadingCom />
  }


  const { donationTotalReq, totalFundAmount, totalUsers } = statictisData;
  return (
    <div>
    <div className="grid md:ml-10 justify-around gap-5 mx-auto md:grid-cols-3">
      <Card className="lg:w-72">

        <CardBody className="text-center">

          <RiUserAddFill className="text-5xl text-blue-600 text-center mx-auto mb-2" />
          <Typography
            variant="lead"
            color="deep-orange"
            textGradient
          >

            Total Users
          </Typography>

        </CardBody>
        <CardFooter className="flex justify-center gap-7 pt-0">
          <Tooltip content="Total Users">
            <Typography as="a" className="text-3xl font-bold" variant="lead" color="red"
              textGradient
            >

              {totalUsers}
            </Typography>
          </Tooltip>

        </CardFooter>
      </Card>
      <Card className="lg:w-72">

        <CardBody className="text-center">

          <RiFundsFill className="text-5xl text-red-600 text-center mx-auto mb-2" />
          <Typography
            variant="lead"
            color="deep-orange"
            textGradient
          >

            Total Fund  Amount
          </Typography>


        </CardBody>
        <CardFooter className="flex justify-center gap-7 pt-0">
          <Tooltip content="Total Fund">
            <Typography className="text-3xl font-bold" variant="lead" color="red"
              textGradient
            >

              ৳{totalFundAmount}
            </Typography>
          </Tooltip>


        </CardFooter>
      </Card>
      <Card className="lg:w-72">

        <CardBody className="text-center">


          <VolunteerActivismTwoTone fontSize="lg" className="text-6xl  text-green-600 text-center mx-auto mb-2" />
          <Typography
            variant="lead"
            color="deep-orange"
            textGradient
          >

            Total Donation Request
          </Typography>



        </CardBody>
        <CardFooter className="flex justify-center gap-7 pt-0">
          <Tooltip content="Total Donation Request">
            <Typography
              className="text-3xl font-bold"

              variant="lead"
              color="red"


              textGradient
            >

              {donationTotalReq}
            </Typography>
          </Tooltip>

        </CardFooter>
      </Card>
    </div>

    {isAdmin && (
      <div className="md:ml-10 mx-auto mt-10 max-w-4xl">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Management
        </Typography>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {MANAGEMENT_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardBody className="flex items-center gap-3">
                  <Icon className="text-[#7A1128]" />
                  <Typography variant="small" className="font-semibold">
                    {label}
                  </Typography>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    )}
    </div>
  );
};


export default AdminHome;
