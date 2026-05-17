import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Particles } from "@/components/ui/particles"
import { Dock, DockIcon } from "@/components/ui/dock"
import { Home, BarChart3, Link2, Copy, Check, Trash2, ExternalLink, QrCode, X } from "lucide-react"

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [originalUrl, setOriginalUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(null)
  const [qrModal, setQrModal] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) { navigate("/"); return }
    fetchUrls()
  }, [])

  async function fetchUrls() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/url/myurls`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setUrls(data)
    } catch {}
  }

  async function handleShorten(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/url/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ originalUrl, customCode: customCode || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Something went wrong"); return }
      setOriginalUrl("")
      setCustomCode("")
      fetchUrls()
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/url/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setUrls((prev) => prev.filter((u) => u._id !== id))
    } catch {}
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      <Particles className="fixed inset-0" quantity={200} ease={30} color="#ffffff" refresh />

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setQrModal(null)} />
          <div className="relative z-10 bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-xs">
            <div className="flex items-center justify-between w-full">
              <span className="text-white text-sm font-medium">QR Code</span>
              <button onClick={() => setQrModal(null)} className="cursor-pointer text-white/40 hover:text-white transition">
                <X size={16} />
              </button>
            </div>
            <img src={qrModal.qrCode} alt="QR Code" className="w-48 h-48 rounded-xl bg-white p-2" />
            <p className="text-white/30 text-xs text-center truncate w-full">{qrModal.shortUrl}</p>
            <a
              href={qrModal.qrCode}
              download={`shortify-qr-${qrModal.shortCode}.png`}
              className="w-full text-center cursor-pointer font-medium bg-white text-black py-2 rounded-xl text-sm hover:bg-white/90 transition"
            >
              Download QR
            </a>
          </div>
        </div>
      )}

      {/* Dock Navbar */}
      <div className="relative z-20 flex justify-center pt-6">
        <Dock className="border-white/10 bg-white/5 backdrop-blur-md">
          <DockIcon onClick={() => navigate("/app")} className="text-white/70 hover:text-white transition">
            <Home size={20} />
          </DockIcon>
          <DockIcon onClick={() => navigate("/analytics")} className="text-white/70 hover:text-white transition">
            <BarChart3 size={20} />
          </DockIcon>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <DockIcon
            as="a"
            onClick={() => window.open("https://github.com/mugeshr19/Shortify", "_blank")}
            className="text-white/70 hover:text-white transition"
          >
            <GithubIcon />
          </DockIcon>
          <DockIcon
            onClick={() => window.open("https://www.linkedin.com/in/mugesh-r-88b190317/", "_blank")}
            className="text-white/70 hover:text-white transition"
          >
            <LinkedInIcon />
          </DockIcon>
        </Dock>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-20">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-white/40 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <Link2 size={12} />
            URL Shortener
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Shorten your links</h1>
          <p className="text-white/40 text-sm">Paste a long URL and get a clean, trackable short link instantly.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleShorten} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-white/30 transition">
              <Link2 size={14} className="text-white/30 shrink-0" />
              <input
                type="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
              />
            </div>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="Custom short code (optional)"
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer font-bold bg-white text-black py-2.5 rounded-xl text-sm hover:bg-white/90 disabled:opacity-50 transition"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>
        </form>

        {/* URL List */}
        {urls.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs text-white/40 uppercase tracking-widest mb-1">Your Links</h2>
            {urls.map((url) => (
              <div key={url._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-white font-medium text-sm truncate">{url.shortUrl}</span>
                  <span className="text-white/30 text-xs truncate">{url.originalUrl}</span>
                  <span className="text-white/20 text-xs">{url.clicks} click{url.clicks !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setQrModal(url)} className="cursor-pointer text-white/40 hover:text-white transition">
                    <QrCode size={15} />
                  </button>
                  <button onClick={() => window.open(url.shortUrl, "_blank")} className="cursor-pointer text-white/40 hover:text-white transition">
                    <ExternalLink size={15} />
                  </button>
                  <button onClick={() => handleCopy(url.shortUrl, url._id)} className="cursor-pointer text-white/40 hover:text-white transition">
                    {copied === url._id ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                  </button>
                  <button onClick={() => handleDelete(url._id)} className="cursor-pointer text-white/40 hover:text-red-400 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {urls.length === 0 && !loading && (
          <div className="text-center text-white/20 text-sm mt-4">No links yet. Shorten your first URL above.</div>
        )}
      </div>
    </div>
  )
}
