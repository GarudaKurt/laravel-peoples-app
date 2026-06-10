import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
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
import { Pencil, Trash2, UserPlus, Users, Search } from "lucide-react";

interface Person {
    id: number;
    firstName: string;
    lastName: string;
}

const emptyForm = { firstName: "", lastName: "" };

const avatarGradients = [
    "from-violet-500 to-indigo-500",
    "from-emerald-400 to-cyan-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
    "from-blue-400 to-indigo-500",
    "from-teal-400 to-emerald-500",
];

export default function PeoplePage() {
    const [people, setPeople] = useState<Person[]>([
        { id: 1, firstName: "Juan", lastName: "dela Cruz" },
        { id: 2, firstName: "Maria", lastName: "Santos" },
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errors, setErrors] = useState(emptyForm);
    const [search, setSearch] = useState("");

    const validate = () => {
        const newErrors = { firstName: "", lastName: "" };
        if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
        setErrors(newErrors);
        return !newErrors.firstName && !newErrors.lastName;
    };

    const openAddSheet = () => {
        setEditingId(null);
        setForm(emptyForm);
        setErrors(emptyForm);
        setIsOpen(true);
    };

    const openEditSheet = (person: Person) => {
        setEditingId(person.id);
        setForm({ firstName: person.firstName, lastName: person.lastName });
        setErrors(emptyForm);
        setIsOpen(true);
    };

    const handleSave = () => {
        if (!validate()) return;
        if (editingId !== null) {
            setPeople((prev) =>
                prev.map((p) =>
                    p.id === editingId
                        ? { ...p, firstName: form.firstName, lastName: form.lastName }
                        : p
                )
            );
        } else {
            const newId = people.length > 0 ? Math.max(...people.map((p) => p.id)) + 1 : 1;
            setPeople((prev) => [...prev, { id: newId, firstName: form.firstName, lastName: form.lastName }]);
        }
        setIsOpen(false);
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        setPeople((prev) => prev.filter((p) => p.id !== id));
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const filtered = people.filter(
        (p) =>
            p.firstName.toLowerCase().includes(search.toLowerCase()) ||
            p.lastName.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}
            <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-base font-bold text-slate-800 tracking-tight">
                            Users Lists
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-violet-700 bg-violet-100 rounded-full px-3 py-1">
                        {people.length} {people.length === 1 ? "person" : "people"}
                    </span>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">People</h1>
                    <p className="text-sm text-slate-500 mt-1">Add, edit, and manage your contacts.</p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                            placeholder="Search by name…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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

                {/* Table card */}
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
                            {filtered.length === 0 ? (
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
                                filtered.map((person, index) => (
                                    <TableRow
                                        key={person.id}
                                        className="group border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        <TableCell className="px-5 text-sm text-slate-400 font-mono">{index + 1}</TableCell>
                                        <TableCell className="px-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarGradients[person.id % avatarGradients.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                                                    {getInitials(person.firstName, person.lastName)}
                                                </div>
                                                <span className="font-semibold text-slate-800 text-sm">{person.firstName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 text-sm text-slate-600">{person.lastName}</TableCell>
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
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {filtered.length > 0 && (
                        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                            <p className="text-xs text-slate-400">
                                Showing {filtered.length} of {people.length} record{people.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-md w-full [&>button]:text-white [&>button]:opacity-90 [&>button:hover]:opacity-100 [&>button:hover]:bg-white/20">

                    {/* Sheet gradient header */}
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
                            {editingId !== null
                                ? "Update the details below."
                                : "Fill in the details to add a new person."}
                        </p>
                    </div>

                    {/* Form body */}
                    <div className="flex-1 px-7 py-7 flex flex-col gap-6 bg-white">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-sm font-semibold text-slate-700">First Name</Label>
                            <Input
                                placeholder="e.g. Juan"
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                className={`h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-violet-500 focus-visible:border-violet-500 ${errors.firstName ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-sm font-semibold text-slate-700">Last Name</Label>
                            <Input
                                placeholder="e.g. dela Cruz"
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                className={`h-11 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-violet-500 focus-visible:border-violet-500 ${errors.lastName ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Sheet footer */}
                    <div className="px-7 py-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <SheetClose asChild>
                            <Button
                                variant="outline"
                                className="flex-1 h-11 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                            >
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            onClick={handleSave}
                            className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-violet-200 rounded-xl"
                        >
                            Save
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}