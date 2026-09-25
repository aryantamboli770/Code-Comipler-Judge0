import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCw, RotateCcw } from "lucide-react";

const BACKEND_URL = "http://localhost:4000";
const ENVS = ["dev", "staging", "prod"];

function Dashboard({ darkMode }) {
  const [status, setStatus] = useState({});
  const [argoStatus, setArgoStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [rollingBack, setRollingBack] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, argoRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/status`),
        axios.get(`${BACKEND_URL}/api/argocd-status`),
      ]);
      setStatus(statusRes.data);
      setArgoStatus(argoRes.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleRollback = async (env) => {
    setRollingBack(env);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/rollback/${env}`);
      toast.success(res.data.message);
      setTimeout(fetchData, 3000); // give Argo CD a moment to sync
    } catch (err) {
      toast.error(err.response?.data?.error || "Rollback failed");
    } finally {
      setRollingBack(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Deployment Dashboard
        </h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ENVS.map((env) => {
          const envKey = `code-compiler-${env}`;
          const podInfo = status[env];
          const argoInfo = argoStatus[envKey];
          const pod = podInfo?.pods?.[0];

          return (
            <div
              key={env}
              className={`rounded-xl p-5 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-sm`}
            >
              <h2
                className={`text-lg font-semibold capitalize mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {env}
              </h2>

              <div
                className={`space-y-1 text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                <p>
                  Version:{" "}
                  <span className="font-mono">{pod?.version ?? "—"}</span>
                </p>
                <p>
                  Pod status:{" "}
                  <span className="font-mono">{pod?.phase ?? "—"}</span>
                </p>
                <p>
                  Restarts:{" "}
                  <span className="font-mono">{pod?.restarts ?? "—"}</span>
                </p>
                <p>
                  Argo sync:{" "}
                  <span
                    className={`font-mono ${argoInfo?.syncStatus === "Synced" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {argoInfo?.syncStatus ?? "—"}
                  </span>
                </p>
                <p>
                  Health:{" "}
                  <span
                    className={`font-mono ${argoInfo?.healthStatus === "Healthy" ? "text-green-500" : "text-red-500"}`}
                  >
                    {argoInfo?.healthStatus ?? "—"}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleRollback(env)}
                disabled={rollingBack === env}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                <RotateCcw
                  size={16}
                  className={rollingBack === env ? "animate-spin" : ""}
                />
                {rollingBack === env ? "Rolling back..." : "Rollback"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
