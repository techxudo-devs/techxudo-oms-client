import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mail, FileSignature } from "lucide-react";
import AppointmentListPage from "./AppointmentListPage";
import EmploymentFormReviewPage from "./EmploymentFormReviewPage";
import ContractManagementPage from "./ContractManagement";
/**
 * HiringManagementPage - Unified page for all hiring workflows
 * Tabs: Appointments → Employment Forms → Contracts
 */
const HiringManagementPage = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hiring Management</h1>
        <p className="text-gray-600 mt-2">
          Manage the complete hiring workflow from appointment letters to
          contracts
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Appointment Letters</span>
            <span className="sm:hidden">Appointments</span>
          </TabsTrigger>
          <TabsTrigger
            value="employment-forms"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Employment Forms</span>
            <span className="sm:hidden">Forms</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileSignature className="w-4 h-4" />
            <span className="hidden sm:inline">Contracts</span>
            <span className="sm:hidden">Contracts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentListPage />
        </TabsContent>

        <TabsContent value="employment-forms" className="space-y-4">
          <EmploymentFormReviewPage />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <ContractManagementPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HiringManagementPage;
