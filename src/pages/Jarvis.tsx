import { TopNavbar } from "@/components/TopNavbar";
import { JarvisChat } from "@/components/JarvisChat";

const Jarvis = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopNavbar />
      
      <main className="flex-1 overflow-hidden">
        <JarvisChat />
      </main>
    </div>
  );
};

export default Jarvis;