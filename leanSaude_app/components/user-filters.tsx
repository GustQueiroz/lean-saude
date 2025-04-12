import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Operator = "equals" | "contains" | "gte" | "lte";
export type Column = "name" | "phone" | "status" | "createdAt";

export interface Filter {
  column: Column;
  operator: Operator;
  value: string;
  condition?: "AND" | "OR";
}

interface UserFiltersProps {
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
}

export function UserFilters({ filters, setFilters }: UserFiltersProps) {
  const [open, setOpen] = useState(false);

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        column: "createdAt",
        operator: "equals",
        value: "",
        condition: filters.length > 0 ? "AND" : undefined,
      },
    ]);
  };

  const updateFilter = (index: number, changes: Partial<Filter>) => {
    const updated = [...filters];
    updated[index] = { ...updated[index], ...changes };
    setFilters(updated);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const renderValueInput = (filter: Filter, index: number) => {
    const isDate = filter.column === "createdAt";
    return (
      <Input
        type={isDate ? "date" : "text"}
        value={filter.value}
        onChange={(e) => updateFilter(index, { value: e.target.value })}
      />
    );
  };

  return (
    <div className="flex items-center gap-2 relative">
      <Button
        variant="outline"
        className={cn(
          "flex items-center gap-1",
          filters.length > 0 && "bg-primary/10 border-primary/20"
        )}
        onClick={() => setOpen(!open)}
      >
        Filtros
        {filters.length > 0 && (
          <Badge className="ml-1 bg-primary text-white">{filters.length}</Badge>
        )}
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>

      {open && (
        <div className="absolute z-20 top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-[650px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Filtros aplicados</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-500"
              >
                Remover todos
              </Button>
            </div>

            {filters.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhum filtro aplicado. Adicione um filtro para refinar os
                resultados.
              </div>
            ) : (
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                      <Select
                        value={filter.condition}
                        onValueChange={(value: "AND" | "OR") =>
                          updateFilter(index, { condition: value })
                        }
                      >
                        <SelectTrigger className="w-[60px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">e</SelectItem>
                          <SelectItem value="OR">ou</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    <Select
                      value={filter.column}
                      onValueChange={(value: Column) =>
                        updateFilter(index, { column: value, value: "" })
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nome</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="createdAt">
                          Data de cadastro
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filter.operator}
                      onValueChange={(value: Operator) =>
                        updateFilter(index, { operator: value })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Operador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">é</SelectItem>
                        <SelectItem value="contains">contém</SelectItem>
                        <SelectItem value="gte">a partir de</SelectItem>
                        <SelectItem value="lte">até</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex-1">
                      {renderValueInput(filter, index)}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(index)}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={addFilter}
            >
              <Plus className="w-4 h-4 mr-1" /> Adicionar filtro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
