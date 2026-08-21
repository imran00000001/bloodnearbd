import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error("Route error:", error);

    return (
        <div>
            <div className="min-h-screen  mx-auto flex flex-col items-center">

                <h2 className="text-4xl absolute top-16 text-red-600 font-bold">
                    {error?.status === 404 ? "404 Not Found" : "Something went wrong"}
                </h2>
                <img
                    className=""
                    src="https://i.ibb.co/7Kspm5n/sad-face-bag-blood-cartoon-raised-up-404-boards-vector-34106742-removebg-preview.png"
                    alt=""
                />

                {/* Temporary diagnostic detail — remove once the underlying bug is found */}
                <pre className="mt-4 max-w-2xl text-xs text-left bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
                    {error?.message || error?.statusText || JSON.stringify(error)}
                </pre>

                <Link to='/'>
                    <button className="bg-red-400 p-4 mt-4 rounded-lg" >Go Back</button>
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;