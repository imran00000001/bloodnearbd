import { Outlet } from "react-router-dom";
import NavBar from "../Components/Shared/NavBar/NavBar";
import Footer from "../Components/Shared/Footer/Footer";
import useAuth from "../hooks/useAuth";

const MainLayout = () => {
    const { loading } = useAuth()
    if (loading) {
        return <>
            <div className="h-screen container mx-auto flex justify-center items-center">
                <img
                    className=""
                    src="https://cdn.dribbble.com/users/251111/screenshots/2775428/dailyui-014.gif"
                    alt=""
                />
            </div>
        </>
    }




    return (<>


        <NavBar />
        <Outlet />
        <a
            href="https://www.messenger.com/t/imranhossain.august2"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-16 text-6xl bottom-16 z-50"
            aria-label="Chat on Facebook Messenger"
        >
            <img className="w-20 hover:scale-110 transition-transform" src="https://cdn.pixabay.com/photo/2021/03/02/12/03/messenger-6062243_1280.png" alt="Messenger" />
        </a>
        <Footer />


    </>


    );
};

export default MainLayout;