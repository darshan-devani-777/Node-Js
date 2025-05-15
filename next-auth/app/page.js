export default function Home() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 rounded-2xl">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-700 p-10 rounded-2xl shadow-2xl text-center max-w-xl w-full">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          🏠 Welcome to the Home Page
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-md">
          Please Register or Login to access more features.
        </p>
      </div>
    </div>
  );
}
