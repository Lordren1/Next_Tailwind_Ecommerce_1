export default function Spinner() {
  return (
    <>
      <div className="flexCenter h-screen  w-full relative">
        {/* Rotating circle */}
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-destructive" />
      </div>
    </>
  );
}
