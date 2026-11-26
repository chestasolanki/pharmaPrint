import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Download, 
  Calendar, 
  Clock, 
  FileText, 
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState('ALL');
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    async function loadScans() {
      const data = await api.getScanHistory();
      setScans(data);
      setFilteredScans(data);
    }
    loadScans();
  }, []);

  useEffect(() => {
    let result = [...scans];

    if (selectedVerdict !== 'ALL') {
      result = result.filter(s => s.verdict === selectedVerdict);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.medicineName.toLowerCase().includes(q) ||
        s.packageId.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.facility.toLowerCase().includes(q)
      );
    }

    setFilteredScans(result);
  }, [searchQuery, selectedVerdict, scans]);

  const handleExportCSV = () => {
    const headers = ['Scan ID', 'Timestamp', 'Package ID', 'Medicine Name', 'Verdict', 'Similarity Score', 'Location', 'Risk Level'];
    const rows = filteredScans.map(s => [
      s.id,
      s.timestamp,
      s.packageId,
      `"${s.medicineName}"`,
      s.verdict,
      `${s.similarityScore}%`,
      `"${s.location.city}"`,
      s.riskLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pharmaprint_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'LIKELY_MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Verified Authentic
          </span>
        );
      case 'CLONED_IDENTITY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Cloned Identity
          </span>
        );
      case 'SUSPICIOUS_DEFECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Defect Ring Match
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>GLOBAL SUPPLY-CHAIN AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verification Scan History
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Immutable forensic record of all physical package scans across ports, transit centers, and pharmacies.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Medicine, Package ID, Facility..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Verdict Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'LIKELY_MATCH', label: 'Verified Authentic' },
            { id: 'CLONED_IDENTITY', label: 'Clones' },
            { id: 'SUSPICIOUS_DEFECT', label: 'Defect Rings' },
            { id: 'UNKNOWN', label: 'Unknown' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedVerdict(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedVerdict === f.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Event ID</th>
                <th className="py-3.5 px-4 font-semibold">Medicine & Serial ID</th>
                <th className="py-3.5 px-4 font-semibold">Verdict</th>
                <th className="py-3.5 px-4 font-semibold">Similarity</th>
                <th className="py-3.5 px-4 font-semibold">Location / Node</th>
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <tr 
                    key={scan.id} 
                    onClick={() => setSelectedScan(scan)}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                      {scan.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{scan.medicineName}</div>
                      <div className="font-mono text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{scan.packageId}</span>
                        {scan.geoAnomaly && (
                          <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20">
                            IMPOSSIBLE TRAVEL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getVerdictBadge(scan.verdict)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={scan.similarityScore >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
                        {scan.similarityScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{scan.location.city}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{scan.facility}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(scan.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1">
                        View Dossier
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No verification records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scan Detail Modal / Drawer */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Verification Telemetry Dossier • {selectedScan.id}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedScan.medicineName}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Package Serial: {selectedScan.packageId}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedScan.imageSnapshot}
                  alt={selectedScan.medicineName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Verification Verdict:</span>
                  <div className="mt-1">{getVerdictBadge(selectedScan.verdict)}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">FAISS Cosine Similarity:</span>
                  <span className="font-bold text-emerald-400">{selectedScan.similarityScore}%</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Inspector / Pharmacist:</span>
                  <span className="text-slate-200">{selectedScan.scannedBy}</span>
                </div>
              </div>
            </div>

            {/* Location & Velocity Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Scan Facility:</span>
                <span>{selectedScan.facility}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Geographic Coordinates:</span>
                <span>{selectedScan.location.city} ({selectedScan.location.lat}, {selectedScan.location.lng})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Scan Timestamp:</span>
                <span>{selectedScan.timestamp}</span>
              </div>
            </div>

            {/* Previous scan details if geo anomaly */}
            {selectedScan.previousScan && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono space-y-1.5 text-rose-300">
                <div className="font-bold text-rose-400 uppercase">Velocity Telemetry Anomaly Detected</div>
                <div>Previous Scan: {selectedScan.previousScan.location}</div>
                <div>Haversine Distance: {selectedScan.previousScan.distanceKm} km</div>
                <div>Time Delta: {selectedScan.previousScan.timeDeltaMinutes} minutes</div>
                <div className="font-bold text-rose-400">
                  Calculated Physical Velocity: {selectedScan.previousScan.calculatedVelocityKmh} km/h (Violation)
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
