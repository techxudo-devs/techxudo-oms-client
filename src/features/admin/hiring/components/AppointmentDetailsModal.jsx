import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

import StatusBadge from "./StatusBadge";

const AppointmentDetailsModal = ({
  selectedAppointment,
  isLoadingDetails,
  closeDetails,
}) => {
  return (
    <Dialog open={!!selectedAppointment} onOpenChange={closeDetails}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Letter Details</DialogTitle>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
          </div>
        ) : selectedAppointment ? (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={selectedAppointment.status} />
              </div>
              {selectedAppointment.respondedAt && (
                <div>
                  <p className="text-sm text-gray-600">Responded At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(
                      new Date(selectedAppointment.respondedAt),
                      "MMM dd, yyyy HH:mm"
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Candidate Info */}
            <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Candidate Name</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.employeeName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.employeeEmail}
                </p>
              </div>
            </div>

            {/* Position Details */}
            <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.letterContent?.position}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.letterContent?.department}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Joining Date</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.letterContent?.joiningDate &&
                    format(
                      new Date(selectedAppointment.letterContent.joiningDate),
                      "MMM dd, yyyy"
                    )}
                </p>
              </div>
            </div>

            {/* Compensation */}
            <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Monthly Salary</p>
                <p className="font-medium text-gray-900">
                  PKR{" "}
                  {selectedAppointment.letterContent?.salary?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Benefits */}
            {selectedAppointment.letterContent?.benefits?.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAppointment.letterContent.benefits.map(
                    (benefit, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {benefit}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {selectedAppointment.letterContent?.additionalTerms && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Additional Terms</p>
                <p className="text-sm text-gray-900">
                  {selectedAppointment.letterContent.additionalTerms}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;
