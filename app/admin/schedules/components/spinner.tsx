import React from "react";

const Spinner: React.FC = () => {
    return (
        <div role="status" className="flex items-center justify-center">
            <svg
                className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.6753 75.0917 6.64388C69.2687 2.59025 62.0043 -0.546734 54.1495 0.678577C46.1082 1.94584 39.5487 5.45382 33.8248 10.1652C28.4275 14.6003 24.3076 20.6221 21.7246 27.6091"
                    fill="currentFill"
                />
            </svg>
        </div>
    );
};

export default Spinner;
