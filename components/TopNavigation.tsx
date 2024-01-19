import {
    useBalance
} from "@thirdweb-dev/react";
import { CustomWalletButton } from "./CustomWalletButton";

const TopNavigation = ({}) => {
    const { data } = useBalance();

    return (
        <div
            style={{
                borderBottom: "1px solid #000000", // Add this line to add a border
                padding: "14px",
            }}
            className="w-full bg-white py-4 px-6 text-black flex justify-between"
        >
            <div>
                <img
                    src="logoside.png"
                    alt="Logo"
                    className="logo"
                    style={{ height: "40px" }}
                />
            </div>
           <CustomWalletButton data={data}/>
        </div>
    );
};

export default TopNavigation;