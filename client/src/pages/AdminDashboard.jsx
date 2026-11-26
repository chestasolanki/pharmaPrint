import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Globe2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  FileSpreadsheet, 
  Filter, 
  RefreshCw, 
  Clock, 
  Search, 
  ChevronRight,
  ArrowUpRight,
  Sliders,
  Flame,
  Activity,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

// Custom SVG map icons to avoid missing default marker asset issues
const createCustomMarker = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const genuineMarker = createCustomMarker('#10b981');
const alertMarker = createCustomMarker('#f43f5e');

export default function AdminDashboard() {
  const [clusters, setClusters] = useState([]);
  const [geoAlerts, setGeoAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedGeoAlert, setSelectedGeoAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('clusters'); // 'clusters' | 'geo' | 'analytics'

  useEffect(() => {
    async function loadAdminData() {
      const [cls, geo, anl] = await Promise.all([
        api.getCounterfeitClusters(),
        api.getGeoAlerts(),
        api.getAnalytics()
      ]);
      setClusters(cls);
      setGeoAlerts(geo);
      setAnalytics(anl);
      if (cls && cls.length > 0) setSelectedCluster(cls[0]);
      if (geo && geo.length > 0) setSelectedGeoAlert(geo[0]);
    }
    loadAdminData();
  }, []);

  const handleUpdateClusterStatus = async (clusterId, newStatus) => {
    await api.updateClusterStatus(clusterId, newStatus);
    setClusters(prev => prev.map(c => c.id === clusterId ? { ...c, status: newStatus } : c));
    if (selectedCluster?.id === clusterId) {
      setSelectedCluster(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleUpdateGeoAlertStatus = async (alertId, newStatus) => {
    await api.updateGeoAlert(alertId, { status: newStatus });
    setGeoAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    if (selectedGeoAlert?.id === alertId) {
      setSelectedGeoAlert(prev => ({ ...prev, status: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">OPEN</span>;
      case 'UNDER_INVESTIGATION':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">IN INVESTIGATION</span>;
      case 'CONFIRMED_COUNTERFEIT':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">CONFIRMED COUNTERFEIT</span>;
      case 'CLOSED':
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>GLOBAL INTELLIGENCE & FORENSIC INVESTIGATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Anti-Counterfeit Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            DBSCAN defect clustering, spatial velocity anomaly telemetry, and coordinated regulatory batch recalls.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('clusters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'clusters' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>DBSCAN Defect Rings</span>
          </button>

          <button
            onClick={() => setActiveTab('geo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'geo' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Impossible-Travel Map</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Defect Clusters"
          value={clusters.length || 3}
          change="+1 ring this week"
          isPositive={false}
          subtitle="DBSCAN Latent Embeddings"
          icon={Layers}
          color="purple"
          badge="eps=0.28"
        />
        <StatCard
          title="Teleportation Anomalies"
          value={geoAlerts.length || 2}
          change="Velocity &gt; 800 km/h"
          isPositive={false}
          subtitle="Cloned Serial In Transit"
          icon={AlertTriangle}
          color="rose"
          badge="High Severity"
        />
        <StatCard
          title="Flagged Packages"
          value="41 Units"
          change="+7 today"
          isPositive={false}
          subtitle="Quarantined at Distribution"
          icon={ShieldAlert}
          color="amber"
          badge="Intervention"
        />
        <StatCard
          title="System Precision"
          value="99.4%"
          change="FAR: 0.002%"
          isPositive={true}
          subtitle="ROC-AUC Calibrated"
          icon={CheckCircle2}
          color="emerald"
          badge="Zero Trust"
        />
      </div>

      {/* TAB 1: DBSCAN COUNTERFEIT DEFECT CLUSTERING */}
      {activeTab === 'clusters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Clusters List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Detected Defect Families (DBSCAN Clusters)
              </span>
              <span className="text-xs text-purple-400 font-mono">eps=0.28, min_samples=3</span>
            </div>

            <div className="space-y-3">
              {clusters.map((cluster) => {
                const isSelected = selectedCluster?.id === cluster.id;
                return (
                  <div
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-400 font-bold text-xs">{cluster.id}</span>
                          <span className="text-white font-bold text-sm truncate max-w-[200px]">
                            {cluster.clusterName.split(':')[1] || cluster.clusterName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {cluster.defectPattern}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(cluster.status)}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{cluster.flaggedPackagesCount} Associated Units</span>
                      <span className="text-purple-300">Intra-Cluster: {(cluster.intraClusterSimilarity * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Cluster Forensic Dossier (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            {selectedCluster ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                      <span>FORENSIC CLUSTER ANALYSIS</span>
                      <span>•</span>
                      <span>{selectedCluster.algorithm}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {selectedCluster.clusterName}
                    </h3>
                  </div>

                  {/* Status Dropdown / Action */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Status:</span>
                    <select
                      value={selectedCluster.status}
                      onChange={(e) => handleUpdateClusterStatus(selectedCluster.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
                      <option value="CONFIRMED_COUNTERFEIT">CONFIRMED COUNTERFEIT</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {/* Defect Signatures Observed */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Observed Physical Packaging Defects
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCluster.defectSignatures?.map((sig, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <span className="font-semibold text-rose-300 block">{sig.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{sig.deviation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affected Medicines & Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-slate-400 text-[11px] uppercase block">Targeted Medicine Brands:</span>
                    <ul className="space-y-1 text-slate-200">
                      {selectedCluster.affectedMedicines?.map((m, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-purple-400">•</span> {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-slate-400 text-[11px] uppercase block">Geographic Interceptions:</span>
                    <ul className="space-y-1 text-slate-200">
                      {selectedCluster.primaryLocations?.map((loc, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {loc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Images of Defect */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Physical Evidence Seizures
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedCluster.sampleImages?.map((url, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-800 relative group">
                        <img src={url} alt="Seized package" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono text-white">
                          Specimen #{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executive Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={() => alert(`Regulatory alert broadcasted for Cluster ${selectedCluster.id}.`)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Issue WHO Medical Product Alert
                  </button>
                  <button
                    onClick={() => alert(`Recall order initiated across affected distribution hubs for ${selectedCluster.affectedMedicines.join(', ')}.`)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    Initiate Supply Chain Quarantine
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a defect cluster to review evidence.</div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: GEO-TEMPORAL CLONE MAP & VELOCITY ANOMALIES */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-rose-400" />
                Real-Time Spatial Velocity Anomalies (Leaflet Engine)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing impossible physical travel calculated via Haversine spherical distance over elapsed time Δt.
              </p>
            </div>
            <div className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>Velocity Threshold: 800 km/h (Commercial Airspeed Bound)</span>
            </div>
          </div>

          {/* Interactive Leaflet Map Container */}
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <MapContainer
              center={[24.0, 75.0]}
              zoom={5}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Anomaly Polyline 1: Delhi to Mumbai (Ozempic Clone) */}
              <Polyline
                positions={[
                  [28.6315, 77.2167], // Delhi
                  [19.0760, 72.8777]  // Mumbai
                ]}
                pathOptions={{
                  color: '#f43f5e',
                  weight: 3,
                  dashArray: '8, 8',
                  dashOffset: '0'
                }}
              />

              <Marker position={[28.6315, 77.2167]} icon={genuineMarker}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-emerald-400">Scan Node A (Delhi)</strong><br />
                    Time: 17:45:00 UTC<br />
                    Package: PHARMA-7734<br />
                    Status: Verified Authentic
                  </div>
                </Popup>
              </Marker>

              <Marker position={[19.0760, 72.8777]} icon={alertMarker}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-rose-400">Scan Node B (Mumbai) - CLONE</strong><br />
                    Time: 18:15:30 UTC (+30 mins)<br />
                    Distance: 1,148 km<br />
                    Calculated Speed: 2,258 km/h (VIOLATION)
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1.5 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Legitimate Origin Node (Scan A)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Impossible Teleportation Node (Scan B)</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400">
                <span>---</span>
                <span>Super-Sonic Velocity Path (&gt; 2,000 km/h)</span>
              </div>
            </div>
          </div>

          {/* Anomaly Incident Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {geoAlerts.map((alert) => (
              <div key={alert.id} className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-3 shadow-glow-rose">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {alert.severity} IMPOSSIBLE TRAVEL
                  </span>
                  <span className="text-xs font-mono text-slate-400">{alert.id}</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{alert.medicineName}</h4>
                  <div className="text-xs font-mono text-slate-400">
                    Serial: {alert.packageId} • Batch: {alert.batchNumber}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Distance:</span>
                    <span className="text-white font-bold">{alert.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Elapsed Time:</span>
                    <span className="text-cyan-400 font-bold">{alert.elapsedMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Velocity:</span>
                    <span className="text-rose-400 font-bold">{alert.calculatedVelocityKmh} km/h</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.recommendation}
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleUpdateGeoAlertStatus(alert.id, 'RESOLVED')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold"
                  >
                    Mark Investigated
                  </button>
                  <button
                    onClick={() => alert(`Freeze order dispatched for Batch ${alert.batchNumber}.`)}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold shadow-glow-rose"
                  >
                    Freeze Batch In Transit
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: ANALYTICS & RECHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Scans Over Time Trend Chart (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Verification Scans Velocity (Last 7 Days)
                  </h3>
                  <p className="text-xs text-slate-400">Genuine verifications vs clone attempts and suspicious defects</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Genuine
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Clones
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.scansByDay || []}>
                    <defs>
                      <linearGradient id="colorGenuine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClones" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="genuine" stroke="#10b981" fillOpacity={1} fill="url(#colorGenuine)" strokeWidth={2} />
                    <Area type="monotone" dataKey="clones" stroke="#f43f5e" fillOpacity={1} fill="url(#colorClones)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Target Medicines Risk Distribution (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Flame className="w-4 h-4 text-rose-400" />
                Targeted Medicine Formulations
              </h3>

              <div className="space-y-4 pt-2">
                {analytics?.threatByMedicine?.map((item) => (
                  <div key={item.name} className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-rose-400 font-bold">{item.threatScore} Threat Index</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                        style={{ width: `${item.threatScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{item.clones} Clones Intercepted</span>
                      <span>{item.suspicious} Suspicious Scans</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
