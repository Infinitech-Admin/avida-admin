
import AddProperties from "./addproperties";
import { PropertyFormProvider } from "./propertyformcontext";

export default function Page() {
  
    return (
        <PropertyFormProvider>
            <AddProperties/>
        </PropertyFormProvider>
    );
}
