import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Particles } from "@/components/ui/particles"
import { Dock, DockIcon } from "@/components/ui/dock"
import { AreaChart } from "@/components/retroui/charts/AreaChart"
import { PieChart } from "@/components/retroui/charts/PieChart"
import { Home, BarChart3, Link2, ChevronDown, ChevronUp } from "lucide-react"

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

function buildClicksOverTime(analytics) {
  const map = {}
  analytics.forEach((click) => {
    const date = new Date(click.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    map[date] = (map[date] || 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, clicks]) => ({ date, clicks }))
}

function buildDeviceData(analytics) {
  const map = {}
  analytics.forEach((click) => {
    const d = click.device || "Unknown"
    map[d] = (map[d] || 0) + 1
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

function LinkAnalyticsCard({ url, token }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    if (data) { setOpen((o) => !o); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/${url._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (res.ok) setData(json)
    } catch {}
    finally { setLoading(false); setOpen(true) }
  }

  const clicksOverTime = data ? buildClicksOverTime(data.analytics) : []
  const deviceData = data ? buildDeviceData(data.analytics) : []

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={load}
        className="cursor-pointer w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
      >
        <div className="flex flex-col items-start gap-0.5 min-w-0">
          <span className="text-white text-sm font-medium truncate max-w-xs">{url.shortUrl}</span>
          <span className="text-white/30 text-xs truncate max-w-xs">{url.originalUrl}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <div className="text-right">
            <div className="text-white font-bold text-lg leading-none">{url.clicks}</div>
            <div className="text-white/30 text-xs">clicks</div>
          </div>
          {loading
            ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            : open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />
          }
        </div>
      </button>

      {/* Expanded analytics */}
      {open && data && (
        <div className="border-t border-white/10 px-5 py-6 flex flex-col gap-8">

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Clicks", value: data.totalClicks },
              { label: "Devices", value: deviceData.length },
              { label: "Days Active", value: clicksOverTime.length },
            ].map((s) => (
              <div key={s.label} className="bg-black/30 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-white font-bold text-xl">{s.value}</div>
                <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Clicks over time */}
          {clicksOverTime.length > 0 ? (
            <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Clicks Over Time</h3>
              <AreaChart
                data={clicksOverTime}
                index="date"
                categories={["clicks"]}
                strokeColors={["#ffffff"]}
                fillColors={["#ffffff"]}
                gridColor="rgba(255,255,255,0.05)"
                tooltipBgColor="#111"
                tooltipBorderColor="rgba(255,255,255,0.1)"
                className="h-48"
              />
            </div>
          ) : (
            <p className="text-white/20 text-xs text-center">No click data yet.</p>
          )}

          {/* Device breakdown */}
          {deviceData.length > 0 && (
            <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Device Breakdown</h3>
              <div className="flex items-center gap-6">
                <PieChart
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  colors={["var(--primary)", "var(--secondary)", "var(--destructive)", "var(--muted)"]}
                  tooltipBgColor="#111"
                  tooltipBorderColor="rgba(255,255,255,0.1)"
                  className="h-52 flex-1"
                />
                <div className="flex flex-col gap-2">
                  {deviceData.map((d, i) => {
                    const colors = ["bg-white", "bg-white/40", "bg-red-400", "bg-white/20"]
                    return (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[i % colors.length]}`} />
                        <span className="text-white/60 text-xs">{d.name}</span>
                        <span className="text-white text-xs font-medium ml-auto pl-4">{d.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Referrers */}
          {data.analytics.length > 0 && (() => {
            const refs = {}
            data.analytics.forEach((c) => { const r = c.referrer || "Direct"; refs[r] = (refs[r] || 0) + 1 })
            return (
              <div>
                <h3 className="text-white/50 text-xs uppercase tracking-widest mb-3">Top Referrers</h3>
                <div className="flex flex-col gap-2">
                  {Object.entries(refs).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ref, count]) => (
                    <div key={ref} className="flex items-center justify-between">
                      <span className="text-white/50 text-xs truncate max-w-xs">{ref}</span>
                      <span className="text-white text-xs font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

        </div>
      )}
    </div>
  )
}

export default function Analytics() {
  const navigate = useNavigate()
  const [urls, setUrls] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) { navigate("/"); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/url/myurls`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUrls(d))
      .catch(() => {})
  }, [])

  const totalClicks = urls.reduce((s, u) => s + u.clicks, 0)
  const topLink = urls.reduce((a, b) => (b.clicks > (a?.clicks || 0) ? b : a), null)

  return (
    <div className="relative min-h-screen bg-black text-white font-sans">
      <Particles className="fixed inset-0" quantity={200} ease={30} color="#ffffff" refresh />

      {/* Dock */}
      <div className="relative z-20 flex justify-center pt-6">
        <Dock className="border-white/10 bg-white/5 backdrop-blur-md">
          <DockIcon onClick={() => navigate("/app")} className="text-white/70 hover:text-white transition">
            <Home size={20} />
          </DockIcon>
          <DockIcon onClick={() => navigate("/analytics")} className="text-white/70 hover:text-white transition">
            <BarChart3 size={20} />
          </DockIcon>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <DockIcon onClick={() => window.open("https://github.com/mugeshr19/Shortify", "_blank")} className="text-white/70 hover:text-white transition">
            <GithubIcon />
          </DockIcon>
          <DockIcon onClick={() => window.open("https://www.linkedin.com/in/mugesh-r-88b190317/", "_blank")} className="text-white/70 hover:text-white transition">
            <LinkedInIcon />
          </DockIcon>
        </Dock>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-20">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-white/40 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <BarChart3 size={12} />
            Analytics
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Link Analytics</h1>
          <p className="text-white/40 text-sm">Click any link to expand its detailed analytics.</p>
        </div>

        {/* Global summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Links", value: urls.length },
            { label: "Total Clicks", value: totalClicks },
            { label: "Top Link Clicks", value: topLink?.clicks ?? 0 },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-white font-bold text-2xl">{s.value}</div>
              <div className="text-white/30 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Per-link cards */}
        {urls.length > 0 ? (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs text-white/40 uppercase tracking-widest mb-1">Your Links</h2>
            {urls.map((url) => (
              <LinkAnalyticsCard key={url._id} url={url} token={token} />
            ))}
          </div>
        ) : (
          <div className="text-center text-white/20 text-sm mt-8">No links yet. Go shorten some URLs first.</div>
        )}

      </div>
    </div>
  )
}
