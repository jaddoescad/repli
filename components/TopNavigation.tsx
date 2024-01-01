import {
    ConnectWallet,
    darkTheme,
    useBalance,
    useUser,
} from "@thirdweb-dev/react";

const TopNavigation = ({}) => {
    const { isLoading, user } = useUser();
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
            <ConnectWallet
                detailsBtn={() => (
                    <button className="border-2 border-gray-700 rounded-full p-2">
                        {`
            ${data?.value} ${data?.name}
            `}
                    </button>
                )}
                style={{
                    minWidth: "50px",
                }}
                theme={darkTheme({
                    colors: {
                        primaryButtonBg: "#A873E8",
                        primaryButtonText: "#FFFFFF",
                    },
                })}
                modalSize="compact"
                btnTitle={"Sign in"}
            />
        </div>
    );
};

export default TopNavigation;