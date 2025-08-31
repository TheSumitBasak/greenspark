"use client";
import { useState } from "react";
import {
  FileText,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
} from "lucide-react";

export default function VerificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewVerification, setShowNewVerification] = useState(false);

  // Mock data for verification requests
  const verifications = [
    {
      id: 1,
      title: "Solar Farm GHC Tokens",
      amount: "500",
      note: "GHC tokens from solar farm operation in Q4 2023",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      documents: ["solar-farm-cert.pdf", "energy-production-report.pdf"],
      verifier: "Verifier #123",
      estimatedCompletion: "2024-01-20",
    },
    {
      id: 2,
      title: "Wind Energy Project",
      amount: "750",
      note: "GHC tokens generated from wind turbine installation",
      status: "approved",
      submittedAt: "2024-01-10T14:20:00Z",
      documents: ["wind-project-plan.pdf", "environmental-assessment.pdf"],
      verifier: "Verifier #456",
      completedAt: "2024-01-14T16:45:00Z",
    },
    {
      id: 3,
      title: "Hydroelectric Plant",
      amount: "1200",
      note: "GHC tokens from hydroelectric power generation",
      status: "rejected",
      submittedAt: "2024-01-05T09:15:00Z",
      documents: ["hydro-plant-specs.pdf", "water-flow-data.pdf"],
      verifier: "Verifier #789",
      rejectedAt: "2024-01-08T11:30:00Z",
      rejectionReason:
        "Insufficient documentation for water source verification",
    },
    {
      id: 4,
      title: "Biomass Energy Facility",
      amount: "300",
      note: "GHC tokens from organic waste processing",
      status: "in_review",
      submittedAt: "2024-01-12T16:00:00Z",
      documents: ["biomass-facility-plan.pdf", "waste-processing-data.pdf"],
      verifier: "Verifier #101",
      estimatedCompletion: "2024-01-18",
    },
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
      in_review: "bg-blue-100 text-blue-800",
    };

    const statusLabels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      in_review: "In Review",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    if (status === "approved") {
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    } else if (status === "rejected") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else if (status === "in_review") {
      return <Clock className="h-5 w-5 text-blue-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredVerifications = verifications.filter(
    (verification) =>
      (verification.status === statusFilter || statusFilter === "all") &&
      (verification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Verification Requests
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your GHC token verification submissions and track their
              status
            </p>
          </div>
          <button
            onClick={() => setShowNewVerification(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Verification
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search verifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Verification List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredVerifications.map((verification) => (
            <li key={verification.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(verification.status)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {verification.title}
                        </h3>
                        <div className="ml-3">
                          {getStatusBadge(verification.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {verification.note}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Amount: {verification.amount} GHC</span>
                        <span>
                          Submitted: {formatTimestamp(verification.submittedAt)}
                        </span>
                        {verification.verifier && (
                          <span>Verifier: {verification.verifier}</span>
                        )}
                      </div>
                      {verification.status === "rejected" &&
                        verification.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong>{" "}
                              {verification.rejectionReason}
                            </p>
                          </div>
                        )}
                      {verification.status === "in_review" &&
                        verification.estimatedCompletion && (
                          <div className="mt-2 text-sm text-blue-600">
                            Estimated completion:{" "}
                            {verification.estimatedCompletion}
                          </div>
                        )}
                      {verification.status === "approved" &&
                        verification.completedAt && (
                          <div className="mt-2 text-sm text-emerald-600">
                            Completed:{" "}
                            {formatTimestamp(verification.completedAt)}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                      <Download className="h-4 w-4 mr-2" />
                      Documents
                    </button>
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Documents:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {verification.documents.map((doc, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {filteredVerifications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No verifications found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by submitting your first GHC token verification."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <div className="mt-6">
              <button
                onClick={() => setShowNewVerification(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Verification
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Verification Modal Placeholder */}
      {showNewVerification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                New Verification
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This would be a form to submit new GHC token verification
                requests.
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <button
                  onClick={() => setShowNewVerification(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
