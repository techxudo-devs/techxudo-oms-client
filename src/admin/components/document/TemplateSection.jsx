import React, { useState } from "react";
import {
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Mail,
  Shield,
  Search,
  Filter,
  Calendar,
  Eye,
  Copy,
  Sparkles,
  Edit3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TemplateSection = ({
  templates,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const templateTypeConfig = {
    nda: {
      icon: FileText,
      label: "NDA",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    contract: {
      icon: Mail,
      label: "Contract",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    undertaking: {
      icon: Shield,
      label: "Undertaking",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  };

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeConfig = (type) => {
    return templateTypeConfig[type] || templateTypeConfig.nda;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-2">
            Document Templates
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and organize your reusable document templates
          </p>
        </div>
        <Button onClick={onAddNew} variant="outline" className="gap-2 ">
          <PlusCircle className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className=" shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Templates
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {templates.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NDAs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {templates.filter((t) => t.type === "nda").length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className=" shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contracts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {templates.filter((t) => t.type === "contract").length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className=" shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Undertakings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {templates.filter((t) => t.type === "undertaking").length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="w-fit">
        <CardContent className="">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="nda">NDA</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="undertaking">Undertaking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}

      <div className="overflow-x-auto border rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b-2">
              <TableHead className="font-semibold text-gray-700">
                Template Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Placeholders
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Created
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">
                      Loading templates...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        No templates found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchQuery || filterType !== "all"
                          ? "Try adjusting your filters"
                          : "Create your first template to get started"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((template) => {
                const typeConfig = getTypeConfig(template.type);
                const IconComponent = typeConfig.icon;

                return (
                  <TableRow
                    key={template._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${typeConfig.bgColor} rounded-lg`}>
                          <IconComponent
                            className={`h-4 w-4 ${typeConfig.color}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {template.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${typeConfig.bgColor} ${typeConfig.color} border ${typeConfig.borderColor} font-medium`}
                      >
                        {typeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {template.placeholders?.slice(0, 3).map((p, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs font-mono bg-gray-50"
                          >
                            {p}
                          </Badge>
                        ))}
                        {template.placeholders?.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-100"
                          >
                            +{template.placeholders.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5" />
                        {template.createdAt
                          ? formatDate(template.createdAt)
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                    
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(template)}
                          className="group cursor-pointer relative p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                          title="Resend document"
                        >
                          <Edit3 size={20} />
                          <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => onDelete(template)}
                          className="group cursor-pointer relative p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all"
                          title="Delete document"
                        >
                          <Trash2 size={20} />
                          <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Delete
                          </span>
                        </button>
                      </div>
                    
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      {!isLoading && filteredTemplates.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 px-1">
          <p>
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredTemplates.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {templates.length}
            </span>{" "}
            templates
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateSection;
