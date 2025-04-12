"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserFilters, Filter } from "@/components/user-filters";
import { UserTable } from "@/components/user-table";
import { api } from "@/lib/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type SearchUser = {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  status: "active" | "inactive";
};

export default function UsuariosPage() {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        params: {
          page: currentPage,
          perPage: itemsPerPage,
          orderBy: sortConfig.key,
          query: searchQuery,
          sort: sortConfig.direction,
          filters: JSON.stringify(filters),
        },
      });

      setUsers(response.data.data);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, sortConfig, filters, searchQuery]);

  const toggleUserStatus = (userId: number) => {
    console.log("Toggling status for user:", userId);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().startsWith(query) ||
      user.phone?.toLowerCase().startsWith(query) ||
      String(user.id).startsWith(query)
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usuários</h1>
      <div className="flex">
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar ID ou nome ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80 mr-10"
          />
        </div>
        <div className="w-40 mr-10">
          <Select
            value={sortConfig.key + "-" + sortConfig.direction}
            onValueChange={(value) => {
              const [key, direction] = value.split("-");
              setSortConfig({
                key: key as "id" | "name" | "phone" | "createdAt" | "status",
                direction: direction as "asc" | "desc",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="createdAt-desc">Mais recentes</SelectItem>
              <SelectItem value="createdAt-asc">Mais antigos</SelectItem>
              <SelectItem value="status-desc">
                Status (Inativos primeiro)
              </SelectItem>
              <SelectItem value="status-asc">
                Status (Ativos primeiro)
              </SelectItem>
              <SelectItem value="id-asc">ID (A-Z)</SelectItem>
              <SelectItem value="id-desc">ID (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <UserFilters filters={filters} setFilters={setFilters} />
      </div>
      <UserTable
        users={filteredUsers}
        loading={loading}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        toggleUserStatus={toggleUserStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
