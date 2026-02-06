const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-t-transparent border-[color:var(--accent)] rounded-full animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
