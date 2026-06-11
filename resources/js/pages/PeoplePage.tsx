import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Pencil, Trash2, UserPlus, Users, Search, Loader2 } from "lucide-react";

interface Person {
    id: number;
    first_name: string;
    last_name: string;
}

const emptyForm = { first_name: "", last_name: "" };
const ITEMS_PER_PAGE = 5;

const avatarGradients = [
    "from-violet-500 to-indigo-500",
    "from-emerald-400 to-cyan-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
    "from-blue-400 to-indigo-500",
    "from-teal-400 to-emerald-500",
];

export default function PeoplePage() {
    const [people, setPeople] = useState<Person[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errors, setErrors] = useState(emptyForm);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        setLoading(true);
        setApiError(null);
        try {
            const res = await fetch("/api/people");
            if (!res.ok) throw new Error("Failed to fetch people.");
            const data = await res.json();
            setPeople(data);
        } catch (e) {
            setApiError("Could not load people. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors = { first_name: "", last_name: "" };
        if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";
        setErrors(newErrors);
        return !newErrors.first_name && !newErrors.last_name;
    };

    const openAddSheet = () => {
        setEditingId(null);
        setForm(emptyForm);
        setErrors(emptyForm);
        setIsOpen(true);
    };

    const openEditSheet = (person: Person) => {
        setEditingId(person.id);
        setForm({ first_name: person.first_name, last_name: person.last_name });
        setErrors(emptyForm);
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        setApiError(null);
        try {
            if (editingId !== null) {
                // PUT
                const res = await fetch(`/api/people/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error("Failed to update person.");
                const updated = await res.json();
                setPeople((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
            } else {
                // POST
                const res = await fetch("/api/people", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error("Failed to create person.");
                const created = await res.json();
                setPeople((prev) => {
                    const updated = [...prev, created];
                    setCurrentPage(Math.ceil(updated.length / ITEMS_PER_PAGE));
                    return updated;
                });
            }
            setIsOpen(false);
            setForm(emptyForm);
            setEditingId(null);
        } catch (e) {
            setApiError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        setApiError(null);
        try {
            const res = await fetch(`/api/people/${id}`, {
                method: "DELETE",
                headers: { "Accept": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to delete person.");
            setPeople((prev) => {
                const updated = prev.filter((p) => p.id !== id);
                const newTotalPages = Math.max(1, Math.ceil(updated.length / ITEMS_PER_PAGE));
                if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
                return updated;
            });
        } catch (e) {
            setApiError("Could not delete. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const filtered = people.filter(
        (p) =>
            p.first_name.toLowerCase().includes(search.toLowerCase()) ||
            p.last_name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    const getPageNumbers = (): (number | "ellipsis-start" | "ellipsis-end")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (safePage <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
        if (safePage >= totalPages - 3) return [1, "ellipsis-start", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "ellipsis-start", safePage - 1, safePage, safePage + 1, "ellipsis-end", totalPages];
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}
            <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-base font-bold text-slate-800 tracking-tight">Users Lists</span>
                    </div>
                    <span className="text-xs font-semibold text-violet-700 bg-violet-100 rounded-full px-3 py-1">
                        {people.length} {people.length === 1 ? "person" : "people"}
                    </span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Users</h1>
                    <p className="text-sm text-slate-500 mt-1">Add, edit, and manage your contacts.</p>
                </div>

                {apiError && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                        {apiError}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                            placeholder="Search by name…"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 h-10 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                        />
                    </div>
                    <Button
                        onClick={openAddSheet}
                        className="h-10 px-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-violet-200 gap-2 rounded-lg"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add New
                    </Button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                                <TableHead className="w-12 text-xs font-bold text-slate-400 uppercase tracking-wider px-5">#</TableHead>
                                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider px-5">First Name</TableHead>
                                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider px-5">Last Name</TableHead>
                                <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider px-5 text-right w-28">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="hover:bg-white">
                                    <TableCell colSpan={4} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
                                            <p className="text-sm text-slate-400">Loading people…</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : paginated.length === 0 ? (
                                <TableRow className="hover:bg-white">
                                    <TableCell colSpan={4} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Users className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-600">
                                                    {search ? "No results found" : "No people yet"}
                                                </p>
                                                <p className="text-sm text-slate-400 mt-0.5">
                                                    {search ? "Try a different search term." : "Click Add New to get started."}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginated.map((person, index) => (
                                    <TableRow
                                        key={person.id}
                                        className="group border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        <TableCell className="px-5 text-sm text-slate-400 font-mono">
                                            {(safePage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </TableCell>
                                        <TableCell className="px-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarGradients[person.id % avatarGradients.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                                                    {getInitials(person.first_name, person.last_name)}
                                                </div>
                                                <span className="font-semibold text-slate-800 text-sm">{person.first_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 text-sm text-slate-600">{person.last_name}</TableCell>
                                        <TableCell className="px-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => openEditSheet(person)}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(person.id)}
                                                    disabled={deletingId === person.id}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingId === person.id
                                                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        : <Trash2 className="h-3.5 w-3.5" />
                                                    }
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {filtered.length > 0 && (
                        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-xs text-slate-400">
                                Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                            </p>
                            <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); if (safePage > 1) setCurrentPage(safePage - 1); }}
                                            className={safePage === 1 ? "pointer-events-none opacity-40" : ""}
                                        />
                                    </PaginationItem>
                                    {getPageNumbers().map((page) =>
                                        page === "ellipsis-start" || page === "ellipsis-end" ? (
                                            <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>
                                        ) : (
                                            <PaginationItem key={`page-${page}`}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === safePage}
                                                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                                    className={page === safePage ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-700 hover:text-white" : ""}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); if (safePage < totalPages) setCurrentPage(safePage + 1); }}
                                            className={safePage === totalPages ? "pointer-events-none opacity-40" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </main>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-md w-full [&>button]:text-white [&>button]:opacity-90 [&>button:hover]:opacity-100 [&>button:hover]:bg-white/20">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 px-7 pt-8 pb-7">
                        <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        <SheetHeader>
                            <SheetTitle className="text-white text-xl font-bold">
                                {editingId !== null ? "Edit Person" : "Add New Person"}
                            </SheetTitle>
                        </SheetHeader>
                        <p className="text-violet-200 text-sm mt-1.5">
                            {editingId !== null ? "Update the details below." : "Fill in the details to add a new person."}
                        </p>
                    </div>

                    <div className="flex-1 px-7 py-7 flex flex-col gap-6 bg-white">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-sm font-semibold text-slate-700">First Name</Label>
                            <Input
                                placeholder="e.g. Juan"
                                value={form.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                className={`h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-violet-500 focus-visible:border-violet-500 ${errors.first_name ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                            />
                            {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Last Name</Label>
                            <Input
                                placeholder="e.g. dela Cruz"
                                value={form.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                className={`h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-violet-500 focus-visible:border-violet-500 ${errors.last_name ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                            />
                            {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="px-7 py-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <SheetClose asChild>
                            <Button variant="outline" className="flex-1 h-11 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-violet-200 rounded-xl gap-2"
                        >
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {saving ? "Saving…" : "Save"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}