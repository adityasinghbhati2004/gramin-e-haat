import React, { useState } from 'react';
import { Package, Heart, Tag, Clock, HelpCircle, Settings, LogOut, User, MapPin, Bell, Globe, Shield, Smartphone, Activity, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Order Details', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'recent', label: 'Recently Viewed', icon: Clock },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  const settingsSubTabs = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'address', label: 'Address Management', icon: MapPin },
    { id: 'notifications', label: 'Notification Settings', icon: Bell },
    { id: 'language', label: 'Language Settings', icon: Globe },
    { id: 'privacy', label: 'Privacy Center', icon: Shield },
    { id: 'device', label: 'Device Management', icon: Smartphone },
    { id: 'activity', label: 'My Activity', icon: Activity },
    { id: 'feedback', label: 'Reviews & Feedback', icon: MessageSquare },
  ];

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">My Account</h1>
        
        <div className="dashboard-layout">
          <div className="sidebar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', borderRight: activeTab === tab.id ? '3px solid var(--primary)' : 'none' }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            <button
              className="sidebar-link"
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: 'var(--danger)', marginTop: '20px' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="dashboard-content">
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Order Details</h2>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <button className="btn btn-primary">Active Orders</button>
                  <button className="btn btn-outline">Delivered Orders</button>
                  <button className="btn btn-outline">Cancelled Orders</button>
                  <button className="btn btn-outline">Delivery Tracking</button>
                </div>
                <div className="empty-state" style={{ border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  <Package size={48} style={{ margin: '0 auto 15px', color: 'var(--border-color)' }} />
                  <p>No active orders found.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Account Settings</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                  {settingsSubTabs.map(sub => {
                    const Icon = sub.icon;
                    return (
                      <div key={sub.id} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }} className="category-card">
                        <Icon size={24} style={{ marginBottom: '10px', color: 'var(--primary)' }} />
                        <div style={{ fontWeight: '500' }}>{sub.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Placeholders for other tabs */}
            {['wishlist', 'coupons', 'recent', 'help'].includes(activeTab) && (
              <div>
                <h2 style={{ marginBottom: '20px', textTransform: 'capitalize' }}>
                  {activeTab.replace('-', ' ')}
                </h2>
                <div className="empty-state" style={{ border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  <p>Nothing to show here yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
