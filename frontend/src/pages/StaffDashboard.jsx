
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Upload,
  X,
  MessageSquare,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import axios from 'axios';

const StaffDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const staffData = location.state?.staffData;

  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/complaints/staff',
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        // Sort complaints from oldest to newest
        const sortedComplaints = response.data.complaints.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setComplaints(sortedComplaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        alert('Failed to load assigned complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (staffData) {
      fetchAssignedComplaints();
    }
  }, [staffData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved-stafflevel':
      case 'resolved-adminlevel':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'open':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'escalated':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved-stafflevel':
      case 'resolved-adminlevel':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Open',
      'in-progress': 'In Progress',
      'resolved-stafflevel': 'Resolved (Staff)',
      'resolved-adminlevel': 'Resolved (Admin)',
      escalated: 'Escalated',
    };
    return labels[status] || status;
  };

  const getDeptLabel = (dept) => {
    const labels = {
      roads: 'Roads',
      water: 'Water Supply',
      waste: 'Waste Management',
      electricity: 'Electricity',
      other: 'Other',
    };
    return labels[dept] || dept;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'open').length,
    inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved-stafflevel').length,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (currentView === 'view-complaint' && selectedComplaint) {
    return (
      <ComplaintDetailView
        complaint={selectedComplaint}
        onBack={() => {
          setCurrentView('dashboard');
          setSelectedComplaint(null);
        }}
        onResolve={() => {
          setCurrentView('resolve-complaint');
        }}
        staffData={staffData}
      />
    );
  }

  if (currentView === 'resolve-complaint' && selectedComplaint) {
    return (
      <ResolveComplaintPage
        complaint={selectedComplaint}
        onBack={() => setCurrentView('view-complaint')}
        onSuccess={(updatedComplaint) => {
          setComplaints((prev) =>
            prev.map((c) => (c._id === updatedComplaint._id ? updatedComplaint : c))
          );
          setSelectedComplaint(updatedComplaint);
          setCurrentView('view-complaint');
        }}
        staffData={staffData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CC</span>
                </div>
                <div className="text-orange-400 font-bold text-2xl">Caravan Chronicle</div>
              </div>
              <p className="text-sm text-blue-200 mt-1">
                Department: {staffData?.dept || 'N/A'} | Location: {staffData?.location?.city || 'N/A'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                <User className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">
                  {staffData?.name || 'Staff Member'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Assigned Tasks</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>
{/* 
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Open</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.open}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div> */}

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">In Progress</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Completed</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{stats.resolved}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Assigned Complaints</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search by ticket ID, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer"
              >
                <option value="all" className="bg-gray-800">Status</option>
                <option value="open" className="bg-gray-800">Open</option>
                <option value="in-progress" className="bg-gray-800">In Progress</option>
                <option value="resolved-stafflevel" className="bg-gray-800">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-12 text-center border border-white/20">
              <Clock className="w-16 h-16 text-white/50 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-white mb-2">Loading complaints...</h3>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-12 text-center border border-white/20">
              <AlertCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No complaints found</h3>
              <p className="text-white/70">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You have no assigned complaints at the moment'}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setCurrentView('view-complaint');
                }}
                className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/20 transition cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {complaint.photoUrl && (
                        <img
                          src={complaint.photoUrl}
                          alt="Complaint"
                          className="w-24 h-24 rounded-lg object-cover border border-white/20"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-sm font-mono font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                            {complaint.ticketId}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority.toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            {getStatusIcon(complaint.status)}
                            {getStatusLabel(complaint.status)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">
                          {complaint.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {complaint.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <span className="inline-flex items-center gap-1">
                            <Filter className="w-4 h-4" />
                            {getDeptLabel(complaint.dept)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {complaint.location.city}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(complaint.createdAt)}
                          </span>
                          {complaint.dueDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Due: {new Date(complaint.dueDate).toLocaleDateString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ComplaintDetailView = ({ complaint, onBack, onResolve, staffData }) => {
  const [newRemark, setNewRemark] = useState('');
  const [isSubmittingRemark, setIsSubmittingRemark] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved-stafflevel':
      case 'resolved-adminlevel':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'open':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'escalated':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved-stafflevel':
      case 'resolved-adminlevel':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Open',
      'in-progress': 'In Progress',
      'resolved-stafflevel': 'Resolved (Staff Level)',
      'resolved-adminlevel': 'Resolved (Admin Level)',
      escalated: 'Escalated',
    };
    return labels[status] || status;
  };

  const getDeptLabel = (dept) => {
    const labels = {
      roads: 'Roads',
      water: 'Water Supply',
      waste: 'Waste Management',
      electricity: 'Electricity',
      other: 'Other',
    };
    return labels[dept] || dept;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAddRemark = async () => {
    if (!newRemark.trim()) return;

    setIsSubmittingRemark(true);
    try {
      await axios.post(
        `http://localhost:3000/api/complaints/${complaint._id}/remark`,
        {
          by: 'staff',
          message: newRemark,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      alert('Remark added successfully!');
      setNewRemark('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding remark:', error);
      alert('Failed to add remark. Please try again.');
    } finally {
      setIsSubmittingRemark(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await axios.patch(
        `http://localhost:3000/api/complaints/resolvecomplaintstaff/${complaint._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      alert('Status updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Complaint Details</h1>
              <p className="text-sm text-blue-200 mt-1">Ticket ID: {complaint.ticketId}</p>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(
                complaint.status
              )}`}
            >
              {getStatusIcon(complaint.status)}
              <span className="font-semibold">{getStatusLabel(complaint.status)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">{complaint.title}</h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(
                    complaint.priority
                  )}`}
                >
                  {complaint.priority.toUpperCase()} Priority
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {getDeptLabel(complaint.dept)}
                </span>
              </div>

              {complaint.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                  <p className="text-white/80 leading-relaxed">{complaint.description}</p>
                </div>
              )}

              {complaint.photoUrl && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-2">Attached Photo</h3>
                  <img
                    src={complaint.photoUrl}
                    alt="Complaint"
                    className="w-full rounded-lg border border-white/20"
                  />
                </div>
              )}

              {complaint.staffresolveproof?.photoUrlupdated && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Resolution Proof</h3>
                  <img
                    src={complaint.staffresolveproof.photoUrlupdated}
                    alt="Resolution Proof"
                    className="w-full rounded-lg border border-white/20"
                  />
                </div>
              )}

              <div className="mt-6 flex gap-3">
                {complaint.status === 'open' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    disabled={isUpdatingStatus}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Working
                  </button>
                )}
                {(complaint.status === 'in-progress' || complaint.status === 'open') && (
                  <button
                    onClick={onResolve}
                    className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition hover:cursor-pointer"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Remarks & Updates
              </h3>

              {complaint.remarks.length === 0 ? (
                <p className="text-white/60 text-center py-8">No remarks yet</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {complaint.remarks.map((remark, index) => (
                    <div key={index} className="border-l-4 border-blue-400 bg-white/5 pl-4 py-3 rounded-r">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            remark.by === 'citizen'
                              ? 'bg-purple-100 text-purple-700'
                              : remark.by === 'staff'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {remark.by.toUpperCase()}
                        </span>
                        <span className="text-xs text-white/60">{formatDate(remark.date)}</span>
                      </div>
                      <p className="text-white/90">{remark.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Add a Remark
                </label>
                <textarea
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="Type your remark here..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddRemark}
                  disabled={isSubmittingRemark || !newRemark.trim()}
                  className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  {isSubmittingRemark ? 'Adding...' : 'Add Remark'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">Complaint Raised</p>
                    <p className="text-xs text-white/60">{formatDate(complaint.createdAt)}</p>
                  </div>
                </div>
                {complaint.assignedStaffId && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-white">Assigned to You</p>
                      <p className="text-xs text-white/60">Staff ID: {complaint.assignedStaffId}</p>
                    </div>
                  </div>
                )}
                {complaint.dueDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-white">Due Date</p>
                      <p className="text-xs text-white/60">
                        {new Date(complaint.dueDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h3>
              <div className="space-y-2">
                <p className="text-white/90">
                  <span className="font-semibold">City:</span> {complaint.location.city}
                </p>
                {complaint.location.lat && complaint.location.lng && (
                  <>
                    <p className="text-white/90">
                      <span className="font-semibold">Latitude:</span> {complaint.location.lat}
                    </p>
                    <p className="text-white/90">
                      <span className="font-semibold">Longitude:</span> {complaint.location.lng}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                      View on Map
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/60">Ticket ID</p>
                  <p className="text-sm font-semibold text-white">{complaint.ticketId}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Department</p>
                  <p className="text-sm font-semibold text-white">
                    {getDeptLabel(complaint.dept)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Priority</p>
                  <p className="text-sm font-semibold text-white">
                    {complaint.priority.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resolve Complaint Page Component
const ResolveComplaintPage = ({ complaint, onBack, onSuccess, staffData }) => {
  const [photoProof, setPhotoProof] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: 'File size should not exceed 5MB',
        }));
        return;
      }
      setPhotoProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, photo: '' }));
    }
  };

  const removePhoto = () => {
    setPhotoProof(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoProof) {
      setErrors({ photo: 'Photo proof is required to mark complaint as resolved' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('resolveimage', photoProof);
      formData.append('resolutionNotes', resolutionNotes);
      // Allow backend to fallback to body string if needed
      formData.append('photoUrlupdated', photoPreview || '');

      const response = await axios.put(
        `http://localhost:3000/api/complaints/resolvecomplaintstaff/${complaint._id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Complaint marked as resolved successfully!');
      onSuccess(response.data.complaint);
    } catch (error) {
      console.error('Error resolving complaint:', error);
      alert('Failed to resolve complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Resolve Complaint</h1>
              <p className="text-sm mt-1 text-blue-200">
                Upload proof of resolution for ticket: {complaint.ticketId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-8 border border-white/20"
        >
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Complaint Summary</h2>
            <div className="space-y-2">
              <p className="text-white/90">
                <span className="font-semibold">Title:</span> {complaint.title}
              </p>
              <p className="text-white/90">
                <span className="font-semibold">Ticket ID:</span> {complaint.ticketId}
              </p>
              <p className="text-white/90">
                <span className="font-semibold">Priority:</span>{' '}
                {complaint.priority.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-3">
              Upload Resolution Proof <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-white/70 mb-4">
              Please upload a clear photo showing that the issue has been resolved
            </p>
            {!photoPreview ? (
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition bg-white/5">
                <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
                <p className="text-sm text-white/80 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-white/60 mb-4">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
                >
                  Choose File
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-white/20"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {errors.photo && <p className="text-red-400 text-sm mt-2">{errors.photo}</p>}
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-2">
              Resolution Notes (Optional)
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Add any additional notes about how the issue was resolved..."
              rows="4"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-200 mb-1">Important</p>
                <p className="text-sm text-yellow-100">
                  Once you submit this resolution, the complaint will be marked as resolved at
                  the staff level. Please ensure the uploaded proof clearly shows the resolved
                  issue.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !photoProof}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Mark as Resolved'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffDashboard