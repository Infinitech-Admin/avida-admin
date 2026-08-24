import { LuAlertCircle } from "react-icons/lu";

const FormikCustomErrorMsg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
        <LuAlertCircle size={16} />
        <span>{children}</span>
    </div>
);

export default FormikCustomErrorMsg;
