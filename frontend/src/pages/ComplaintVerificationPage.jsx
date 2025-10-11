import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Filter,
  Calendar,
  MessageSquare,
  Image,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
// import { useCallback } from "react";
const ComplaintVerificationPage = ({ complaint, onBack, onVerifySuccess }) => {
//   const [complaintDetails, setComplaintDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAction, setVerificationAction] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

//   const fetchComplaintDetails = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/api/complaints/${complaint._id}`,
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       setComplaintDetails(response.data.complaint);
//     } catch (error) {
//       console.error("Error fetching complaint details:", error);
//       alert("Failed to load complaint details");
//     } finally {
//       setLoading(false);
//     }
//   }, [complaint._id]);

//   useEffect(() => {
//     fetchComplaintDetails();
//   }, [fetchComplaintDetails]);

  const handleVerificationClick = (action) => {
    setVerificationAction(action);
    setShowModal(true);
  };

  const handleAdminVerify = async () => {
    setIsVerifying(true);
    try {
      await axios.put(
        `http://localhost:3000/api/complaints/resolvecomplaintadmin/${complaint._id}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      alert("Complaint verified at admin level.");
      onVerifySuccess && onVerifySuccess();
      onBack();
    } catch (error) {
      console.error("Error verifying at admin level:", error);
      alert("Failed to verify complaint at admin level.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = async () => {
    if (verificationAction === "reject" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsVerifying(true);
    try {
      const endpoint =
        verificationAction === "approve"
          ? `http://localhost:3000/api/complaints/verify/${complaint._id}`
          : `http://localhost:3000/api/complaints/reject/${complaint._id}`;

      await axios.put(
        endpoint,
        verificationAction === "reject" ? { reason: rejectionReason } : {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      alert(
        `Complaint ${verificationAction === "approve" ? "verified" : "rejected"} successfully!`
      );
      setShowModal(false);
      onVerifySuccess();
      onBack();
    } catch (error) {
      console.error("Error verifying complaint:", error);
      alert(`Failed to ${verificationAction} complaint`);
    } finally {
      setIsVerifying(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-white">Loading complaint details...</p>
//         </div>
//       </div>
//     );
//   }

  const details =  complaint;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                Complaint Details & Verification
              </h1>
              <p className="text-sm text-white/70 mt-1">
                Ticket ID: {details.ticketId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-sm font-mono font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                  {details.ticketId}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(
                    details.priority
                  )}`}
                >
                  {details.priority.toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                    details.status
                  )}`}
                >
                  {getStatusIcon(details.status)}
                  {getStatusLabel(details.status)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                {details.title}
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">Description</p>
                  <p className="text-white/90">{details.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" />
                      Department
                    </p>
                    <p className="text-white font-semibold">
                      {getDeptLabel(details.dept)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </p>
                    <p className="text-white font-semibold">
                      {details.location?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created At
                    </p>
                    <p className="text-white font-semibold">
                      {formatDate(details.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last Updated
                    </p>
                    <p className="text-white font-semibold">
                      {formatDate(details.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {details.photoUrl && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Original Complaint Photo
                </h3>
                <img
                  src={details.photoUrl}
                  alt="Complaint"
                  className="w-full rounded-lg border border-white/20"
                />
              </div>
            )}

            {details.status === "resolved-stafflevel" && details.staffresolveproof?.photoUrlupdated && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Staff Resolution Proof
                </h3>
                <img
                  src={details.staffresolveproof.photoUrlupdated}
                  alt="Resolution Proof"
                  className="w-full max-h-96 object-contain rounded-lg border border-white/20 mb-4"
                />
                <button
                  onClick={handleAdminVerify}
                  disabled={isVerifying}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? "Verifying..." : "Confirm & Mark Resolved"}
                </button>
              </div>
            )}

            {details.statusHistory && details.statusHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {details.statusHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex gap-3 pb-3 border-b border-white/10 last:border-0"
                    >
                      <div className="mt-1">
                        {getStatusIcon(history.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">
                          {getStatusLabel(history.status)}
                        </p>
                        <p className="text-white/60 text-sm">
                          {formatDate(history.timestamp)}
                        </p>
                        {history.remarks && (
                          <p className="text-white/70 text-sm mt-1">
                            {history.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Assigned Staff
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/50">Staff ID</p>
                  <p className="text-white font-semibold">
                    {details.assignedStaffId || "N/A"}
                  </p>
                </div>
                {details.assignedStaffName && (
                  <div>
                    <p className="text-xs text-white/50">Name</p>
                    <p className="text-white font-semibold">
                      {details.assignedStaffName}
                    </p>
                  </div>
                )}
                {details.assignedAt && (
                  <div>
                    <p className="text-xs text-white/50">Assigned At</p>
                    <p className="text-white font-semibold">
                      {formatDate(details.assignedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {details.status === "resolved-stafflevel" && details.resolutionProof && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Verification Required
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  Please review the resolution proof provided by the staff and
                  verify if the work has been completed satisfactorily.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleVerificationClick("approve")}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Mark Resolved
                  </button>

                  <button
                    onClick={() => handleVerificationClick("reject")}
                    className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject & Reassign
                  </button>
                </div>
              </div>
            )}

            {details.status === "resolved-adminlevel" && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-bold text-white">
                    Verified by Admin
                  </h3>
                </div>
                <p className="text-white/70 text-sm">
                  This complaint has been successfully verified and marked as
                  resolved.
                </p>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">
                Additional Information
              </h3>
              <div className="space-y-3 text-sm">
                {/* <div className="flex items-center gap-2 text-white/70">
                  <MessageSquare className="w-4 h-4" />
                  <span>Upvotes: {details.upvotes || 0}</span>
                </div> */}
                {details.location?.coordinates && (
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span>
                      Coordinates: {details.location.coordinates.lat.toFixed(4)}
                      , {details.location.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              {verificationAction === "approve" ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-400" />
              )}
              <h3 className="text-xl font-bold text-white">
                {verificationAction === "approve"
                  ? "Approve Resolution"
                  : "Reject Resolution"}
              </h3>
            </div>

            <p className="text-white/80 mb-6">
              {verificationAction === "approve"
                ? "Are you sure you want to approve this resolution? The complaint will be marked as resolved by admin."
                : "Please provide a reason for rejecting this resolution. The complaint will be reassigned to the staff."}
            </p>

            {verificationAction === "reject" && (
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent mb-4"
                rows="4"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason("");
                }}
                disabled={isVerifying}
                className="flex-1 px-4 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className={`flex-1 px-4 py-3 font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer ${
                  verificationAction === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isVerifying ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintVerificationPage;
