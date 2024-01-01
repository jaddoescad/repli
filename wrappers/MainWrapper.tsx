type MainWrapperProps = {
    children: React.ReactNode;
};

const MainWrapper: React.FC<MainWrapperProps> = ({ children }) => {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  export default MainWrapper;