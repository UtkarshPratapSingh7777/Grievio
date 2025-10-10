import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Users,
  MessageSquare,
  Calendar,
  ArrowLeft,
  UserPlus,
  TrendingUp,
  Activity,
} from "lucide-react";
import axios from "axios";
import ComplaintVerificationPage from "./ComplaintVerificationPage";
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminData = location.state?.adminData;
  // console.log(adminData);
  const [currentView, setCurrentView] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminData) {
      fetchComplaints();
      fetchStaff();
    }
  }, [adminData]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/complaints/admin",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/staff/all",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved-stafflevel":
      case "resolved-adminlevel":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "open":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "escalated":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };
const getDeptLabel = (dept) => {
    const labels = {
      roads: "Roads",
      water: "Water Supply",
      waste: "Waste Management",
      electricity: "Electricity",
      other: "Other",
    };
    return labels[dept] || dept;
  };
 

  const getStatusLabel = (status) => {
    const labels = {
      open: "Open",
      "in-progress": "In Progress",
      "resolved-stafflevel": "Resolved (Staff)",
      "resolved-adminlevel": "Resolved (Admin)",
      escalated: "Escalated",
    };
    return labels[status] || status;
  };

  const getDeptLabel = (dept) => {
    const labels = {
      roads: "Roads",
      water: "Water Supply",
      waste: "Waste Management",
      electricity: "Electricity",
      other: "Other",
    };
    return labels[dept] || dept;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status.includes("resolved")).length,
    unassigned: complaints.filter((c) => !c.assignedStaffId).length,
  };

  if (currentView === "assign-complaint" && selectedComplaint) {
    return (
      <AssignComplaintView
        complaint={selectedComplaint}
        staff={staff}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedComplaint(null);
        }}
        onAssignSuccess={fetchComplaints}
      />
    );
  }
  const getDeptLabel = (dept) => {
    const labels = {
      roads: "Roads",
      water: "Water Supply",
      waste: "Waste Management",
      electricity: "Electricity",
      other: "Other",
    };
    return labels[dept] || dept;
  };
  if (currentView === "view-complaint" && selectedComplaint) {
    return (
      <ComplaintVerificationPage
        complaint={selectedComplaint}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedComplaint(null);
        }}
        // onVerifySuccess={fetchComplaints}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10 relative z-[60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CC</span>
                </div>
                <div className="text-orange-400 font-bold text-2xl">
                  Caravan Chronicle
                </div>
              </div>
              <p className="text-sm text-purple-200 mt-1">
                Department: {getDeptLabel(adminData?.dept)} | Location:{" "}
                {adminData?.location?.city}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ActivityBell userType="admin" />
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                <User className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">
                  {adminData?.name || "Admin"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">
                  Total Complaints
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Open</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.open}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">In Progress</p>
                <p className="text-3xl font-bold text-blue-300 mt-2">
                  {stats.inProgress}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Resolved</p>
                <p className="text-3xl font-bold text-green-300 mt-2">
                  {stats.resolved}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Unassigned</p>
                <p className="text-3xl font-bold text-orange-300 mt-2">
                  {stats.unassigned}
                </p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-orange-300" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Manage Complaints
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                <option value="all" className="bg-gray-800">
                  Status
                </option>
                <option value="open" className="bg-gray-800">
                  Open
                </option>
                <option value="in-progress" className="bg-gray-800">
                  In Progress
                </option>
                <option value="resolved-stafflevel" className="bg-gray-800">
                  Resolved (Staff)
                </option>
                <option value="resolved-adminlevel" className="bg-gray-800">
                  Resolved (Admin)
                </option>
                <option value="escalated" className="bg-gray-800">
                  Escalated
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-12 text-center border border-white/20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-12 text-center border border-white/20">
              <AlertCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No complaints found
              </h3>
              <p className="text-white/70">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "No complaints in your department yet"}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20 hover:bg-white/15 transition"
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
                          <span className="text-sm font-mono font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
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
                          {!complaint.assignedStaffId && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                              UNASSIGNED
                            </span>
                          )}
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
                          {complaint.assignedStaffId && (
                            <span className="inline-flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Staff: {complaint.assignedStaffId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    {complaint.assignedStaffId ? (
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setCurrentView("view-complaint");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setCurrentView("assign-complaint");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign
                      </button>
                    )}
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

const AssignComplaintView = ({ complaint, staff, onBack, onAssignSuccess }) => {
  const [assignmentMode, setAssignmentMode] = useState("manual");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualAssign = async () => {
    if (!selectedStaffId) {
      alert("Please select a staff member");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:3000/api/complaints/assign/${complaint._id}`,
        { staffId: selectedStaffId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Complaint assigned successfully!");
      onAssignSuccess();
      onBack();
    } catch (error) {
      console.error("Error assigning complaint:", error);
      alert("Failed to assign complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoAssign = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:3000/api/complaints/assign/${complaint._id}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Complaint auto-assigned successfully!");
      onAssignSuccess();
      onBack();
    } catch (error) {
      console.error("Error auto-assigning complaint:", error);
      alert("Failed to auto-assign complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.dept === complaint.dept && s.location?.city === complaint.location?.city
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Assign Complaint to Staff
              </h1>
              <p className="text-sm text-white/70 mt-1">
                Ticket ID: {complaint.ticketId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">
                Complaint Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/50">Title</p>
                  <p className="text-sm font-semibold text-white">
                    {complaint.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Department</p>
                  <p className="text-sm font-semibold text-white">
                    {complaint.dept}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Location</p>
                  <p className="text-sm font-semibold text-white">
                    {complaint.location.city}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Priority</p>
                  <p className="text-sm font-semibold text-white uppercase">
                    {complaint.priority}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Status</p>
                  <p className="text-sm font-semibold text-white">
                    {complaint.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-6">
                Choose Assignment Method
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setAssignmentMode("manual")}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                    assignmentMode === "manual"
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-white/30 hover:border-white/50"
                  }`}
                >
                  <User className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white font-semibold">Manual Assignment</p>
                  <p className="text-white/60 text-xs mt-1">
                    Select specific staff
                  </p>
                </button>

                <button
                  onClick={() => setAssignmentMode("auto")}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                    assignmentMode === "auto"
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-white/30 hover:border-white/50"
                  }`}
                >
                  <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white font-semibold">Auto Assignment</p>
                  <p className="text-white/60 text-xs mt-1">
                    Least workload staff
                  </p>
                </button>
              </div>

              {assignmentMode === "manual" && (
                <div>
                  <h4 className="text-white font-semibold mb-3">
                    Available Staff ({filteredStaff.length})
                  </h4>
                  {filteredStaff.length === 0 ? (
                    <p className="text-white/60 text-center py-8">
                      No staff available for this department and location
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                      {filteredStaff.map((staffMember) => (
                        <div
                          key={staffMember._id}
                          onClick={() => setSelectedStaffId(staffMember._id)}
                          className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                            selectedStaffId === staffMember._id
                              ? "border-purple-500/50 bg-purple-500/20"
                              : "border-white/30 hover:border-white/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-semibold">
                                {staffMember.name}
                              </p>
                              <p className="text-white/60 text-sm">
                                ID: {staffMember.staffId || staffMember._id}
                              </p>
                              <p className="text-white/60 text-sm">
                                Current Load: {staffMember.taskCount || 0}{" "}
                                complaints
                              </p>
                            </div>
                            {selectedStaffId === staffMember._id && (
                              <CheckCircle className="w-6 h-6 text-purple-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleManualAssign}
                    disabled={isSubmitting || !selectedStaffId}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Assigning..." : "Assign to Selected Staff"}
                  </button>
                </div>
              )}

              {assignmentMode === "auto" && (
                <div>
                  <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-6 mb-6">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Auto Assignment
                    </h4>
                    <p className="text-white/80 text-sm">
                      This will automatically assign the complaint to the staff
                      member with the lowest current workload in the same
                      department and location.
                    </p>
                  </div>

                  <button
                    onClick={handleAutoAssign}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Assigning..." : "Auto Assign to Staff"}
                  </button>
                </div>
              )}

              <button
                onClick={onBack}
                className="w-full mt-4 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

const ActivityBell = ({ userType }) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/activity/${userType}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setItems(res.data.items || []);
    } catch (e) {
      console.error("Error fetching activity:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchActivity();
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {items.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 z-50 shadow-lg rounded-lg">
          <div className="p-3 border-b border-white/10 text-white font-semibold">Recent Activity</div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-white/70">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-4 text-white/60">No recent activity</div>
            ) : (
              items.map((a) => (
                <div key={a._id} className="p-3 border-b border-white/10 text-white/90 text-sm">
                  <div>{a.message}</div>
                  <div className="text-xs text-white/50">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
