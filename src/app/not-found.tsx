import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full w-full flex-col">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-700">
        The page you are looking for does not exist. Please check the URL or go
        back to the homepage.
      </p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Go to Homepage
      </Link>
    </div>
  );
}
