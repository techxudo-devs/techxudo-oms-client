import React from "react";
import { Calendar, Plus } from "lucide-react";
import { useLeaveManagement } from "../hooks/useLeaveManagement";
import LeaveBalanceCard from "../components/leaves-manage/LeaveBalanceCard";
import LeaveRequestForm from "../components/leaves-manage/LeaveRequestForm";
import LeaveHistoryTable from "../components/leaves-manage/LeaveHistoryTable";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const LeaveManagementPage = () => {
  const {
    leaveBalance,
    leaveRequests,
    isBalanceLoading,
    isRequestsLoading,
    isSubmitting,
    isCancelling,
    showLeaveForm,
    formData,
    daysCount,
    toggleLeaveForm,
    handleInputChange,
    handleAttachmentChange,
    handleSubmit,
    handleCancelRequest,
    resetForm,
    getBalanceProgress,
  } = useLeaveManagement();

  const balanceProgress = getBalanceProgress();

  return (
    <PageLayout
      title="Leave Management"
      subtitle="Manage your leave requests and view your balance"
      icon={Calendar}
      actions={
        <Button
          variant={"outline"}
          onClick={toggleLeaveForm}
          disabled={isSubmitting || isCancelling}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showLeaveForm ? "Hide Form" : "Apply for Leave"}
        </Button>
      }
    >
      <AnimatePresence>
        {showLeaveForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <LeaveRequestForm
              formData={formData}
              daysCount={daysCount}
              onInputChange={handleInputChange}
              onAttachmentChange={handleAttachmentChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              isLoading={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Balance Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <LeaveBalanceCard
          type="casual"
          balance={leaveBalance?.casual || { total: 0, used: 0, remaining: 0 }}
          progress={balanceProgress.casual}
          isLoading={isBalanceLoading}
        />
        <LeaveBalanceCard
          type="sick"
          balance={leaveBalance?.sick || { total: 0, used: 0, remaining: 0 }}
          progress={balanceProgress.sick}
          isLoading={isBalanceLoading}
        />
        <LeaveBalanceCard
          type="annual"
          balance={leaveBalance?.annual || { total: 0, used: 0, remaining: 0 }}
          progress={balanceProgress.annual}
          isLoading={isBalanceLoading}
        />
      </div>

      {/* Apply for Leave Button */}
      {/* <div className="mb-6">
        <button
          onClick={toggleLeaveForm}
          disabled={isSubmitting || isCancelling}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showLeaveForm ? 'Hide Form' : 'Apply for Leave'}
        </button>
      </div>
      </button>
    }
  >
    {/* Balance Cards Section */}

      {/* Leave Request Form */}

      {/* Leave Request Form */}
      {showLeaveForm && (
        <LeaveRequestForm
          formData={formData}
          daysCount={daysCount}
          onInputChange={handleInputChange}
          onAttachmentChange={handleAttachmentChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isSubmitting}
        />
      )}

      {/* My Leave History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          My Leave History
        </h2>
        <LeaveHistoryTable
          leaveRequests={leaveRequests}
          onDelete={handleCancelRequest}
          isLoading={isRequestsLoading}
        />
      </div>
    </PageLayout>
  );
};

export default LeaveManagementPage;
