import React, { useState } from 'react';
import { 
  Calendar, Video, Mail, MessageSquare, Clock, Plus, UserCheck, ShieldCheck, CheckCircle2, AlertCircle, Send, PhoneCall, Building2, Bell, MessageCircle
} from 'lucide-react';

const INITIAL_MEETINGS = [
  {
    id: 'meet-1',
    oemBrand: 'Aditya Infotech (CP Plus)',
    contactName: 'M/s Aditya Infotech Enterprise Team',
    contactEmail: 'sales.india@cpplusworld.com',
    contactPhone: '+91 120 4555666',
    projectName: 'Northern Central Railway STQC Locomotive CCTV Project',
    poNumber: 'PO-2026-5398',
    subject: 'STQC Certificate Verification & Quantity Pricing Negotiation for 4K Bullet Cameras',
    date: '2026-08-08',
    time: '11:00 AM',
    platform: 'Google Meet',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'SCHEDULED'
  },
  {
    id: 'meet-2',
    oemBrand: 'Streamax Technology',
    contactName: 'Vikram Sharma (Head of Enterprise Sales)',
    contactEmail: 'vikram.sharma@streamax.com',
    contactPhone: '+91 98123 45678',
    projectName: 'MSRTC Bus Depot & Fleet Mobile CCTV Security Project',
    poNumber: 'PO-MSRTC-2026',
    subject: 'MSRTC 8CH Mobile NVR ADAS & AIS-140 Testing Alignment',
    date: '2026-08-10',
    time: '02:30 PM',
    platform: 'Microsoft Teams',
    meetLink: 'https://teams.microsoft.com/l/meetup-join/sample',
    status: 'CONFIRMED'
  }
];

const INITIAL_UPDATES = [
  {
    id: 'upd-1',
    author: 'Procurement Team Lead',
    time: 'Today, 02:15 PM',
    text: 'CP Plus confirmed STQC Certificate STQC/IOTSCS/ER/001 validation for 4K Bullet camera model CP-UNC-TE81ZL6C-VMDS-Q.',
    type: 'SUCCESS'
  },
  {
    id: 'upd-2',
    author: 'Technical Director',
    time: 'Yesterday, 05:40 PM',
    text: 'Streamax X3-H0801 mobile NVR sample unit dispatched for MSRTC depot field testing.',
    type: 'INFO'
  }
];

export default function MeetingRoomHub({ projects, products }) {
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newUpdateText, setNewUpdateText] = useState('');

  const [newMeeting, setNewMeeting] = useState({
    oemBrand: 'Aditya Infotech (CP Plus)',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    projectId: projects[0]?.id || '',
    subject: 'Technical Specification Verification & Commercial Quote Meeting',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    platform: 'Google Meet',
    meetLink: 'https://meet.google.com/new'
  });

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === newMeeting.projectId) || projects[0];

    const created = {
      ...newMeeting,
      id: `meet-${Date.now()}`,
      projectName: proj.name,
      poNumber: proj.poNumber || proj.code || 'N/A',
      status: 'SCHEDULED'
    };

    setMeetings([created, ...meetings]);

    // Also add to team activity log
    const newActivity = {
      id: `upd-${Date.now()}`,
      author: 'Brihaspathi Team',
      time: 'Just now',
      text: `Scheduled OEM Meeting with ${created.oemBrand} for project "${proj.name}" (PO: ${created.poNumber}) on ${created.date} at ${created.time}.`,
      type: 'INFO'
    };
    setUpdates([newActivity, ...updates]);

    setShowScheduleModal(false);
    alert(`Meeting scheduled with ${created.oemBrand}!`);
  };

  const handleAddTeamUpdate = (e) => {
    e.preventDefault();
    if (!newUpdateText.trim()) return;

    const entry = {
      id: `upd-${Date.now()}`,
      author: 'Brihaspathi Team Lead',
      time: 'Just now',
      text: newUpdateText,
      type: 'INFO'
    };

    setUpdates([entry, ...updates]);
    setNewUpdateText('');
  };

  const handleSendEmailInvite = (meet) => {
    const subject = encodeURIComponent(`Meeting Request: Brihaspathi Tech x ${meet.oemBrand} [PO: ${meet.poNumber}]`);
    const body = encodeURIComponent(
`Dear ${meet.contactName || meet.oemBrand},

We would like to schedule a technical alignment and procurement meeting regarding project:
• Project: ${meet.projectName}
• PO / Tender ID: ${meet.poNumber}
• Meeting Subject: ${meet.subject}
• Date & Time: ${meet.date} at ${meet.time}
• Join Link: ${meet.meetLink}

Please confirm your availability or let us know if you need any adjustments.

Best Regards,
Brihaspathi Technologies Product Procurement Team
www.brihaspathi.com`
    );

    window.open(`mailto:${meet.contactEmail || 'sales@oem.com'}?subject=${subject}&body=${body}`);
  };

  const handleSendWhatsAppChat = (meet) => {
    const cleanPhone = (meet.contactPhone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
`Hello ${meet.contactName || meet.oemBrand}, regarding Brihaspathi project ${meet.poNumber} (${meet.projectName}): We have scheduled a meeting on ${meet.date} at ${meet.time}. Join Link: ${meet.meetLink}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Video size={24} color="#6366f1" />
            <h2 style={{ fontSize: '1.25rem' }}>OEM Meeting Room & Team Updates Hub</h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Schedule 1-click video calls with OEM suppliers, send instant email/WhatsApp invites, and track live procurement updates.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowScheduleModal(true)}>
          <Calendar size={15} /> + Schedule New OEM Meeting
        </button>
      </div>

      {/* Main Grid: Scheduled Meetings on Left, Team Updates Log on Right */}
      <div className="grid-cols-3" style={{ gap: '1.25rem' }}>
        {/* Left Column (2 Span): Scheduled OEM Meetings */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '13px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} /> UPCOMING OEM & PROCUREMENT MEETINGS ({meetings.length}):
          </h3>

          {meetings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <Video size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <p>No meetings scheduled yet. Click "+ Schedule New OEM Meeting" to get started.</p>
            </div>
          ) : (
            meetings.map(meet => (
              <div key={meet.id} className="card" style={{ 
                borderLeft: '4px solid #6366f1', padding: '1.1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.85) 0%, rgba(99, 102, 241, 0.05) 100%)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-accept" style={{ fontSize: '10.5px' }}>
                        <Building2 size={11} /> {meet.oemBrand}
                      </span>
                      <span className="badge badge-conditional" style={{ fontSize: '10.5px' }}>
                        <Clock size={11} /> {meet.date} @ {meet.time}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', marginTop: '0.4rem' }}>{meet.subject}</h3>
                    
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Project: <strong>{meet.projectName}</strong> | PO/Tender ID: <strong>{meet.poNumber}</strong>
                    </p>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-main)', marginTop: '0.35rem' }}>
                      Contact: <strong>{meet.contactName || meet.oemBrand}</strong> ({meet.contactEmail || 'N/A'} | {meet.contactPhone || 'N/A'})
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end' }}>
                    <a 
                      href={meet.meetLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                    >
                      <Video size={13} /> Join {meet.platform}
                    </a>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ fontSize: '11px', padding: '0.25rem 0.5rem' }}
                        onClick={() => handleSendEmailInvite(meet)}
                      >
                        <Mail size={12} /> Email Invite
                      </button>

                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ fontSize: '11px', padding: '0.25rem 0.5rem', color: '#34d399' }}
                        onClick={() => handleSendWhatsAppChat(meet)}
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column (1 Span): Live Team Updates & Activity Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '13px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={15} /> LIVE TEAM UPDATES & LOG:
          </h3>

          {/* Add Quick Update Box */}
          <div className="card" style={{ padding: '0.85rem' }}>
            <form onSubmit={handleAddTeamUpdate}>
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '11.5px' }}>Post Quick Update for Team:</label>
                <textarea 
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. Received OEM technical spec confirmation for tender PO-2026..."
                  value={newUpdateText}
                  onChange={(e) => setNewUpdateText(e.target.value)}
                  style={{ fontSize: '12px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '11.5px' }}>
                <Send size={12} /> Post Update to Team
              </button>
            </form>
          </div>

          {/* Updates Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {updates.map(upd => (
              <div key={upd.id} className="card" style={{ 
                padding: '0.75rem 0.85rem', 
                borderLeft: upd.type === 'SUCCESS' ? '3px solid #34d399' : '3px solid #38bdf8',
                background: 'rgba(11, 15, 25, 0.75)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  <strong style={{ color: '#ffffff' }}>{upd.author}</strong>
                  <span>{upd.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.35 }}>
                  {upd.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={20} color="#6366f1" /> Schedule OEM & Team Meeting
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Create a video meeting room with OEM manufacturers for project spec alignment and commercial negotiation.
            </p>

            <form onSubmit={handleScheduleMeeting}>
              <div className="form-row">
                <div className="form-group">
                  <label>OEM Brand / Manufacturer *</label>
                  <select 
                    className="form-select"
                    value={newMeeting.oemBrand}
                    onChange={(e) => setNewMeeting({ ...newMeeting, oemBrand: e.target.value })}
                  >
                    <option value="Aditya Infotech (CP Plus)">Aditya Infotech (CP Plus)</option>
                    <option value="Streamax Technology">Streamax Technology</option>
                    <option value="ZKTeco Inc">ZKTeco Inc</option>
                    <option value="Jinko Solar">Jinko Solar</option>
                    <option value="Howen Technologies">Howen Technologies</option>
                    <option value="HikVision">HikVision</option>
                    <option value="Dahua Technology">Dahua Technology</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Project / PO Number *</label>
                  <select 
                    className="form-select"
                    value={newMeeting.projectId}
                    onChange={(e) => setNewMeeting({ ...newMeeting, projectId: e.target.value })}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (PO: {p.poNumber || p.code || 'N/A'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Meeting Purpose / Subject *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. STQC Specification Verification & Price Negotiation"
                  value={newMeeting.subject}
                  onChange={(e) => setNewMeeting({ ...newMeeting, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 11:00 AM"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Platform *</label>
                  <select 
                    className="form-select"
                    value={newMeeting.platform}
                    onChange={(e) => setNewMeeting({ ...newMeeting, platform: e.target.value })}
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Zoom">Zoom Video</option>
                    <option value="Direct Call">Direct Call / Phone</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>OEM Representative Contact Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Vikram Sharma"
                    value={newMeeting.contactName}
                    onChange={(e) => setNewMeeting({ ...newMeeting, contactName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>OEM Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="sales.india@cpplusworld.com"
                    value={newMeeting.contactEmail}
                    onChange={(e) => setNewMeeting({ ...newMeeting, contactEmail: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>OEM Phone / WhatsApp</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="+91 120 4555666"
                    value={newMeeting.contactPhone}
                    onChange={(e) => setNewMeeting({ ...newMeeting, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Video Meeting Room Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={newMeeting.meetLink}
                  onChange={(e) => setNewMeeting({ ...newMeeting, meetLink: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
