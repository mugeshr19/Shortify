import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { BorderBeam } from "@/components/ui/border-beam"
import { Particles } from "@/components/ui/particles"
import { Link2, Loader2 } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      localStorage.setItem("token", data.token)
      navigate("/app")
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4">
      <Particles className="absolute inset-0" quantity={200} ease={30} color="#ffffff" refresh />
      <div className="relative w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 p-8 overflow-hidden">
        <BorderBeam size={80} duration={8} colorFrom="#888888" colorTo="#444444" borderWidth={1.5} />

        <div className="flex items-center gap-2 mb-8">
          <span className="text-white font-semibold text-lg">Shortify</span>
        </div>

        <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-white/40 text-sm mb-7">Sign in to your Shortify account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/40 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/40 transition"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 cursor-pointer flex items-center justify-center gap-2 bg-white hover:bg-white/90 disabled:opacity-50 transition text-black font-medium text-sm py-2.5 rounded-xl"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-white/40 text-xs text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:text-white/70 transition underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
