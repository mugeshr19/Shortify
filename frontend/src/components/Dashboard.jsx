import { useNavigate } from "react-router-dom"
import { Particles } from "@/components/ui/particles"
import { Text } from "@/components/retroui/Text"
import { KineticText } from "./ui/kinetic-text"

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">

      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={30}
        color="#ffffff"
        refresh
      />

      <nav className="w-full px-4 py-4">
      
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-10 py-3 backdrop-blur-md">
        
        {/* Logo */}
        <Text className="text-2xl font-bold text-white">
          Shortify
        </Text>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-105"
          >
            Sign Up
          </button>

        </div>

      </div>

    </nav>

    <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center leading-none">

        <KineticText
            text="More than"
            className="text-[6rem] tracking-tight text-white"
        />

        <KineticText
            text="just shorter links"
            className="text-[6rem] tracking-tight text-white"
        />
        <Text className="mt-10 max-w-xl text-base text-white/60">
          Shorten, track, and manage your links with powerful analytics.
        </Text>    
        <div className="mt-12">
          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer font-bold bg-white text-black px-8 py-3.5 text-lg border-2 border-black shadow-[4px_4px_0px_#888] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2"
          >
            Get Started <span className="font-black text-xl align-middle leading-none">➜</span>
          </button>
        </div>

    </div>

    </div>
  )
}

export default Dashboard
