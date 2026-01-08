export default function Gradient() {
  return (
    <div>
        <div className="w-full h-[10vh] left-0 right-0 top-0 bg-gradient-to-b from-brand-whiteback to-transparent absolute z-0 flex items-center justify-center min-h-screen"></div>
        <div className="w-[30vw] h-[100vh] left-0 top-0 bg-gradient-to-r from-brand-primary to-transparent absolute -z-10 flex items-center justify-center min-h-screen"></div>
        <div className="w-[30vw] h-[100vh] right-0 top-0 bg-gradient-to-l from-brand-primary to-transparent absolute -z-10 flex items-center justify-center min-h-screen"></div>
        <div className="w-full h-[10vh] left-0 right-0 bg-gradient-to-t from-brand-whiteback to-transparent absolute z-0 flex items-center justify-center min-h-screen"></div>
    </div>
  );
}