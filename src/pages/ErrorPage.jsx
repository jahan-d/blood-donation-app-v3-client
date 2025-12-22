import { Link } from "react-router";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center p-5">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-4xl font-semibold mt-4">Page Not Found</h2>
            <p className="text-lg mt-2 mb-8 max-w-md">
                Oops! The page you are looking for does not exist. It might have been
                moved or deleted.
            </p>
            <Link to="/" className="btn btn-primary btn-wide">
                Go Home
            </Link>
        </div>
    );
};

export default ErrorPage;
