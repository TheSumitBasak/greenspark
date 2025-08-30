import { FrontFooter } from "@/components/FrontFooter";
import FrontHeader from "@/components/FrontHeader";

export default function FrontLayout({ children }) {
    return (
        <div>
            <FrontHeader />
            {children}
            <FrontFooter />
        </div>
    )
}
