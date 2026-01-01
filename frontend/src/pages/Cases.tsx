import React, {useState, useEffect, useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from '@/contexts/AuthContext';
import {caseService} from '@/services/case.service';
import {userService} from '@/services/user.service';
import {Case, User} from '@/types';
import {createCaseSchema, assignCaseSchema, CreateCaseFormData, AssignCaseFormData} from '@/lib/validations';
import {useToast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Badge} from '@/components/ui/badge';
import {format} from 'date-fns';
import {
    Briefcase,
    Plus,
    Loader2,
    UserPlus,
    AlertCircle,
    RefreshCw,
    Shield,
    Trash2,
} from 'lucide-react';

const Cases: React.FC = () => {
    const {isAdmin, user} = useAuth();
    const {toast} = useToast();
    const [cases, setCases] = useState<Case[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Create modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Assign modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningCase, setAssigningCase] = useState<Case | null>(null);

    // Delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingCase, setDeletingCase] = useState<Case | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Forms
    const createForm = useForm<CreateCaseFormData>({
        resolver: zodResolver(createCaseSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const assignForm = useForm<AssignCaseFormData>({
        resolver: zodResolver(assignCaseSchema),
        defaultValues: {
            userId: '',
        },
    });

    const fetchCases = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await caseService.getCases();
            setCases(response || []);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
            // Mock data for demo
            setCases([]);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await userService.getUsers();
            setUsers(response || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // Mock users for demo
            setUsers([]);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchCases();
        if (isAdmin) {
            fetchUsers();
        }
    }, [fetchCases, isAdmin]);

    const handleCreateCase = async (data: CreateCaseFormData) => {
        setIsSubmitting(true);

        try {
            await caseService.createCase({title: data.title, description: data.description});
            toast({title: 'Case created successfully'});
            setIsCreateModalOpen(false);
            createForm.reset();
            fetchCases();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create case',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenAssign = (caseItem: Case) => {
        setAssigningCase(caseItem);
        assignForm.reset({userId: caseItem.assignedUserId || ''});
        setIsAssignModalOpen(true);
    };

    const handleAssignCase = async (data: AssignCaseFormData) => {
        if (!assigningCase) return;
        setIsSubmitting(true);

        try {
            await caseService.assignCase(assigningCase.id, {userId: data.userId});
            toast({title: 'Case assigned successfully'});
            setIsAssignModalOpen(false);
            setAssigningCase(null);
            fetchCases();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to assign case',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDelete = (caseItem: Case) => {
        setDeletingCase(caseItem);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingCase) return;
        setIsDeleting(true);

        try {
            await caseService.deleteCase(deletingCase.id);
            toast({title: 'Case deleted successfully'});
            setIsDeleteDialogOpen(false);
            setDeletingCase(null);
            fetchCases();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete case',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Cases</h1>
                    <p className="mt-1 text-muted-foreground">
                        {isAdmin ? 'Manage and assign support cases' : 'View your assigned cases'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchCases}>
                        <RefreshCw className="h-4 w-4"/>
                    </Button>
                    {isAdmin && (
                        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4"/>
                                    New Case
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <Form {...createForm}>
                                    <form onSubmit={createForm.handleSubmit(handleCreateCase)}>
                                        <DialogHeader>
                                            <DialogTitle>Create New Case</DialogTitle>
                                            <DialogDescription>
                                                Create a new support case for tracking
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <FormField
                                                control={createForm.control}
                                                name="title"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Customer Complaint" {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createForm.control}
                                                name="description"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Describe the issue in detail..."
                                                                rows={4}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline"
                                                    onClick={() => setIsCreateModalOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                Create Case
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Admin-only notice for users */}
            {!isAdmin && (
                <Card className="border-warning/50 bg-warning/5">
                    <CardContent className="flex items-center gap-3 p-4">
                        <AlertCircle className="h-5 w-5 text-warning"/>
                        <p className="text-sm text-warning">
                            Only administrators can create and assign cases. You can view cases assigned to you.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Assign Modal */}
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent>
                    <Form {...assignForm}>
                        <form onSubmit={assignForm.handleSubmit(handleAssignCase)}>
                            <DialogHeader>
                                <DialogTitle>Assign Case</DialogTitle>
                                <DialogDescription>
                                    Assign "{assigningCase?.title}" to a team member
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <FormField
                                    control={assignForm.control}
                                    name="userId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Assign to</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a user"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoadingUsers ? (
                                                        <div className="flex items-center justify-center py-4">
                                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                                        </div>
                                                    ) : (
                                                        users.map((u) => (
                                                            <SelectItem key={u.id} value={u.id}>
                                                                {u.name} ({u.email})
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Assign
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Case</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingCase?.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cases Table */}
            <Card className="border-border/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">All Cases</CardTitle>
                    <CardDescription>{cases.length} total cases</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        </div>
                    ) : cases.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Briefcase className="h-12 w-12 text-muted-foreground/50"/>
                            <h3 className="mt-4 text-lg font-semibold">No cases found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {isAdmin ? 'Create your first case to get started' : 'No cases have been assigned to you'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Created</TableHead>
                                        {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cases.map((caseItem) => (
                                        <TableRow key={caseItem.id}>
                                            <TableCell className="font-medium">{caseItem.title}</TableCell>
                                            <TableCell className="max-w-xs truncate text-muted-foreground">
                                                {caseItem.description}
                                            </TableCell>
                                            <TableCell>
                                                {caseItem.assignedUser ? (
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                                            {caseItem.assignedUser.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm">{caseItem.assignedUser.name}</span>
                                                    </div>
                                                ) : (
                                                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                                                        <AlertCircle className="h-3 w-3"/>
                                                        Unassigned
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(new Date(caseItem.createdAt), 'PP')}
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenAssign(caseItem)}
                                                            className="gap-1"
                                                        >
                                                            <UserPlus className="h-4 w-4"/>
                                                            Assign
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenDelete(caseItem)}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Admin Badge Info */}
            {isAdmin && (
                <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="flex items-center gap-3 p-4">
                        <Shield className="h-5 w-5 text-primary"/>
                        <p className="text-sm text-primary">
                            You have administrator privileges. You can create new cases and assign them to users.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Cases;
