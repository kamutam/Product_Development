import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, ExternalLink, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(new Date());

  const fetchUpdates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('oem_notifications')
        .select('*')
        .order('dateAnnounced', { ascending: false });

      if (sbError) throw sbError;
      
      setNotifications(data || []);
      setLastChecked(new Date());
    } catch (err) {
      console.error(err);
      setError(`Database Error: ${err.message || 'Check console for details.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchUpdates, 300000);
    return () => clearInterval(interval);
  }, []);

  const timeSince = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Bell size={22} color="#f59e0b" />
            <h2 style={{ fontSize: '1.25rem' }}>Automated OEM Notifications</h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Real-time alerts for new product launches, firmware updates, and certification changes from partner OEMs.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchUpdates} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} /> 
          {isLoading ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} /> Last synchronized: {lastChecked.toLocaleTimeString()}
        </span>
        {error && <span style={{ color: '#ef4444' }}>⚠️ {error}</span>}
      </div>

      {/* Notifications List */}
      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
        {isLoading && notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 1rem', display: 'block', color: '#38bdf8' }} />
            Connecting to OEM Webhooks...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 1rem', display: 'block', color: '#10b981' }} />
            You're all caught up! No new OEM product launches detected today.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((notif) => (
              <div key={notif.id} style={{ 
                background: '#1e293b', 
                border: '1px solid rgba(56, 189, 248, 0.2)', 
                borderRadius: '8px', 
                padding: '1.25rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Unread indicator */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#38bdf8' }}></div>

                {/* Brand Initial Logo */}
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {notif.oem.charAt(0)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#f8fafc' }}>
                      {notif.oem} Launched a New Product: <span style={{ color: '#38bdf8' }}>{notif.productName}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {timeSince(notif.dateAnnounced)}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
                    Model: <strong>{notif.sku}</strong> | Type: <strong>{notif.type}</strong> | Resolution: <strong>{notif.resolution}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {notif.stqcCertified && (
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '11px' }}>
                        <ShieldCheck size={12} style={{ marginRight: '0.2rem' }}/> STQC Certified Launch
                      </span>
                    )}
                    {notif.araiCertified && (
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '11px' }}>
                        <ShieldCheck size={12} style={{ marginRight: '0.2rem' }}/> ARAI AIS-140 TAC Launch
                      </span>
                    )}
                    <a href={notif.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '11px' }}>
                      <ExternalLink size={12} /> View Official PR / Datasheet
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
