"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  toggleUserStatus: (userId: number) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
}

export function UserTable({
  users,
  sortConfig,
  setSortConfig,
  toggleUserStatus,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${
          sortConfig.key === key ? "text-primary" : ""
        }`}
      />
    );
  };

  function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 11) return phone;
    return `+55 (${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  }

  function indexOfFirstItem(currentPage: number, itemsPerPage: number): number {
    return (currentPage - 1) * itemsPerPage;
  }

  function indexOfLastItem(currentPage: number, itemsPerPage: number): number {
    return currentPage * itemsPerPage;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("id")}
                  className="flex items-center"
                >
                  ID {renderSortIcon("id")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center"
                >
                  Nome {renderSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("phone")}
                  className="flex items-center"
                >
                  Telefone {renderSortIcon("phone")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center"
                >
                  Data de cadastro {renderSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="flex items-center"
                >
                  Status {renderSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={selectedUser === user.id ? "bg-muted/50" : ""}
                >
                  <TableCell>{String(user.id).slice(0, 8)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{formatPhone(user.phone)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status.toLowerCase() === "active"
                          ? "outline"
                          : "destructive"
                      }
                      className={
                        user.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                          : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                      }
                    >
                      {user.status.toLowerCase() === "active"
                        ? "Ativo"
                        : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "active" ? "Inativar" : "Ativar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Linhas por página</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {indexOfFirstItem(currentPage, itemsPerPage) + 1}-
            {Math.min(indexOfLastItem(currentPage, itemsPerPage), totalItems)}{" "}
            de {totalItems}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
