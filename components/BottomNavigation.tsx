import { useRouter } from "next/router";

const BottomNavigation = () => {
  const router = useRouter();

  const navigationItems = [
    {
      icon: (
        <img
          src={"/bottom-navigation-icons/searchuser.png"}
          alt="Contacts"
          style={{ width: "26px", height: "26px" }}
        />
      ),
      label: "Contacts",
      route: "/contacts", // Add route for Contacts
    },
    {
      icon: (
        <img
          src={"/bottom-navigation-icons/chatdollar.png"}
          alt="Chat Dollar"
          style={{ width: "26px", height: "26px" }}
        />
      ),
      label: "Chats",
      route: "/chats", // Add route for Chat
    },
    {
      icon: (
        <img
          src={"/bottom-navigation-icons/profile.png"}
          style={{ width: "26px", height: "26px" }}
        />
      ),
      label: "Profile",
      route: "/profile", // Add route for Profile
    },
  ];

  const navigateToRoute = (route: string) => {
    router.push(route);
  };

  return (
    <div
      className="w-full bg-white px-6 text-black flex justify-between items-center border-t-2 border-gray-300
            pb-10
            pt-4
            "
    >
      {navigationItems.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center"
          style={{ opacity: router.pathname === item.route ? 1 : 0.4 }}
          onClick={() => navigateToRoute(item.route)}
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: "12px" }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;
