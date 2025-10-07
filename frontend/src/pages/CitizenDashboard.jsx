import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Plus,
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
} from "lucide-react";
import axios from "axios";

const CitizenDashboard = () => { 
  const location = useLocation();  
  const navigate = useNavigate();  
  const userData = location.state?.userData; 

  const [currentView, setCurrentView] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/complaints/citizen`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        
        setComplaints(response.data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        alert("Failed to load complaints. Please try again later.");
      }
    };

    if (userData) {
      fetchComplaints();
    }
  }, [userData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved-stafflevel":
      case "resolved-adminlevel":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "open":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "escalated":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved-stafflevel":
      case "resolved-adminlevel":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "escalated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    escalated: complaints.filter((c) => c.status === "escalated").length,
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

  if (currentView === "raise-complaint") {
    return (
      <RaiseComplaintPage
        onBack={() => setCurrentView("dashboard")}
        userData={userData}
        setComplaints={setComplaints}
      />
    );
  }

  if (currentView === "view-complaint" && selectedComplaint) {
    return (
      <ComplaintDetailView
        complaint={selectedComplaint}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedComplaint(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className=" w-full bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 ">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CC</span>
                </div>
                <div className="text-orange-400  font-bold text-2xl">
                  Caravan Chronicle
                </div>
              </div>
              <p className="text-sm text-blue-200 mt-1">
                Welcome back, {userData.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {userData.citizenId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-200 rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Complaints
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.open}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.inProgress}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.resolved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalated</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.escalated}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button and Filters */}
        <div className="bg-gray-200 rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              onClick={() => setCurrentView("raise-complaint")}
              className="inline-flex items-center hover:cursor-pointer justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Raise New Complaint
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ticket ID, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 hover:cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved-stafflevel">Resolved (Staff)</option>
                <option value="resolved-adminlevel">Resolved (Admin)</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">My Complaints</h2>

          {filteredComplaints.length === 0 ? (
            <div className="bg-gray-200 rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't raised any complaints yet"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <button
                  onClick={() => setCurrentView("raise-complaint")}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Raise Your First Complaint
                </button>
              )}
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setCurrentView("view-complaint");
                }}
                className="bg-gray-200 rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {complaint.photoUrl && (
                        <img
                          src={complaint.photoUrl}
                          alt="Complaint"
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {complaint.ticketId}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(
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

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {complaint.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {complaint.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                              Due:{" "}
                              {new Date(complaint.dueDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>

                        {complaint.remarks.length > 0 && (
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">
                              {complaint.remarks.length} remark(s)
                            </span>
                          </div>
                        )}
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

// Raise Complaint Page Component
const RaiseComplaintPage = ({ onBack, userData, setComplaints }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dept: "",
    location: {
      city: "Kanpur",
      lat: "",
      lng: "",
    },
    priority: "medium",
    photoUrl: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    { value: "roads", label: "Roads", icon: "🛣️" },
    { value: "water", label: "Water Supply", icon: "💧" },
    { value: "waste", label: "Waste Management", icon: "🗑️" },
    { value: "electricity", label: "Electricity", icon: "⚡" },
    { value: "other", label: "Other", icon: "📋" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "green" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "high", label: "High", color: "red" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "File size should not exceed 5MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, photoUrl: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: null }));
    setPhotoPreview(null);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
            },
          }));
        },
        (error) => {
          alert("Unable to retrieve location. Please enter manually.");
        }
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.dept) newErrors.dept = "Department is required";
    if (!formData.location.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/complaints/create",
        {
          title: formData.title,
          description: formData.description,
          dept: formData.dept,
          location: formData.location,
          priority: formData.priority,
          citizenId: userData.citizenId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setComplaints((prev) => [...prev, response.data.complaint]);
      console.log("Complaint submitted:", response.data);
      alert("Complaint raised successfully!");
      onBack(); // navigate back after success
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className=" w-full bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:cursor-pointer hover:text-white hover:bg-blue-800 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-orange-400 " />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-orange-400">
                Raise New Complaint
              </h1>
              <p className="text-sm mt-1 text-blue-200">
                Fill in the details below to register your complaint
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 rounded-xl shadow-sm p-8 border border-gray-300"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief description of the issue"
              className={`w-full px-4 py-3 border ${
                errors.title ? "border-red-500" : "border-gray-400"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Department */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Department <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {departments.map((dept) => (
                <button
                  key={dept.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, dept: dept.value }))
                  }
                  className={`p-4 rounded-lg hover:cursor-pointer border-2 transition ${
                    formData.dept === dept.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-3xl mb-2 hover:cursor-pointer">
                    {dept.icon}
                  </div>
                  <div className="text-sm font-medium hover:cursor-pointer text-gray-700">
                    {dept.label}
                  </div>
                </button>
              ))}
            </div>
            {errors.dept && (
              <p className="text-red-500 text-sm mt-1">{errors.dept}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about the issue..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={`w-full px-4 py-3 border ${
                    errors.city ? "border-red-500" : "border-gray-400"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <input
                type="text"
                name="location.lat"
                value={formData.location.lat}
                onChange={handleInputChange}
                placeholder="Latitude (optional)"
                className="px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                name="location.lng"
                value={formData.location.lng}
                onChange={handleInputChange}
                placeholder="Longitude (optional)"
                className="px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5 hover:cursor-pointer" />
                Get Location
              </button>
            </div>
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: priority.value,
                    }))
                  }
                  className={`p-4 rounded-lg hover:cursor-pointer border-2 transition ${
                    formData.priority === priority.value
                      ? `border-${priority.color}-500 bg-${priority.color}-50`
                      : "border-gray-400 hover:border-gray-500"
                  }`}
                >
                  <div
                    className={`text-sm hover:cursor-pointer font-semibold ${
                      formData.priority === priority.value
                        ? `text-${priority.color}-700`
                        : "text-gray-700"
                    }`}
                  >
                    {priority.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Photo (Optional)
            </label>
            {!photoPreview ? (
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center hover:border-blue-400 transition">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 5MB</p>
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
                  className="w-full h-64 object-cover rounded-lg"
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
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border-2 hover:cursor-pointer border-gray-400 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r hover:cursor-pointer from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Complaint Detail View Component
const ComplaintDetailView = ({ complaint, onBack }) => {
  const [newRemark, setNewRemark] = useState("");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved-stafflevel":
      case "resolved-adminlevel":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-blue-500" />;
      case "open":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "escalated":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved-stafflevel":
      case "resolved-adminlevel":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "escalated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: "Open",
      "in-progress": "In Progress",
      "resolved-stafflevel": "Resolved (Staff Level)",
      "resolved-adminlevel": "Resolved (Admin Level)",
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

  const handleAddRemark = () => {
    if (newRemark.trim()) {
      console.log("Adding remark:", newRemark);
      // Here you would typically make an API call to add the remark
      alert("Remark added successfully!");
      setNewRemark("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Complaint Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Ticket ID: {complaint.ticketId}
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(
                complaint.status
              )}`}
            >
              {getStatusIcon(complaint.status)}
              <span className="font-semibold">
                {getStatusLabel(complaint.status)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {complaint.title}
              </h2>

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
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
              )}

              {complaint.photoUrl && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Attached Photo
                  </h3>
                  <img
                    src={complaint.photoUrl}
                    alt="Complaint"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {complaint.staffresolveproof?.photoUrlupdated && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Resolution Proof
                  </h3>
                  <img
                    src={complaint.staffresolveproof.photoUrlupdated}
                    alt="Resolution Proof"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Remarks Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Remarks & Updates
              </h3>

              {complaint.remarks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No remarks yet</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {complaint.remarks.map((remark, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            remark.by === "citizen"
                              ? "bg-purple-100 text-purple-700"
                              : remark.by === "staff"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {remark.by.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(remark.date)}
                        </span>
                      </div>
                      <p className="text-gray-700">{remark.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Remark */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add a Remark
                </label>
                <textarea
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="Type your remark here..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddRemark}
                  className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Add Remark
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Complaint Raised
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                </div>
                {complaint.assignedStaffId && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Assigned to Staff
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {complaint.assignedStaffId}
                      </p>
                    </div>
                  </div>
                )}
                {complaint.dueDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Due Date
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(complaint.dueDate).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">City:</span>{" "}
                  {complaint.location.city}
                </p>
                {complaint.location.lat && complaint.location.lng && (
                  <>
                    <p className="text-gray-700">
                      <span className="font-semibold">Latitude:</span>{" "}
                      {complaint.location.lat}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Longitude:</span>{" "}
                      {complaint.location.lng}
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

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Ticket ID</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {complaint.ticketId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getDeptLabel(complaint.dept)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priority</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {complaint.priority.toUpperCase()}
                  </p>
                </div>
                {complaint.assignedStaffId && (
                  <div>
                    <p className="text-xs text-gray-500">Assigned Staff ID</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {complaint.assignedStaffId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
