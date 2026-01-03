import {
    Users as UsersIcon,
    Search,
    Loader2,
    UserCheck,
    UserX,
    Shield,
    X,
} from 'lucide-react';
import {format} from 'date-fns';
import React, {useState, useMemo} from 'react';

import {User} from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import {useToast} from '@/hooks/use-toast';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/contexts/AuthContext';
import {useUsers, useToggleUserStatus} from '@/hooks/useUsers';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {AppPagination} from "@/components/common/Pagination.tsx";

const Users: React.FC = () => {
    const {user: currentUser} = useAuth();
    const {toast} = useToast();

    const limit = 10;

    const [page, setPage] = useState(1);
    const {data, isLoading} = useUsers(page, limit);

    const users = data.data;
    const meta = data?.meta;

    const toggleStatusMutation = useToggleUserStatus();

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && !user.isDeleted) ||
                (statusFilter === 'inactive' && user.isDeleted);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const handleToggleStatus = async () => {
        if (!selectedUser) return;

        try {
            await toggleStatusMutation.mutateAsync({
                id: selectedUser.id,
                isDeleted: !selectedUser.isDeleted,
            });

            toast({
                title: 'Success',
                description: `User ${selectedUser.isDeleted ? 'activated' : 'deactivated'} successfully`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user status',
                variant: 'destructive',
            });
        } finally {
            setIsToggleDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setRoleFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters = searchQuery || roleFilter !== 'all' || statusFilter !== 'all';

    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter((u) => !u.isDeleted).length;
        const inactive = users.filter((u) => u.isDeleted).length;
        const admins = users.filter((u) => u.role === 'ADMIN').length;
        return {total, active, inactive, admins};
    }, [users]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">
                    Manage system users and their access status
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Users
                        </CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Users
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-emerald-500"/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Inactive Users
                        </CardTitle>
                        <UserX className="h-4 w-4 text-destructive"/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-destructive">{stats.inactive}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Administrators
                        </CardTitle>
                        <Shield className="h-4 w-4 text-primary"/>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-primary">{stats.admins}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Role"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="icon" onClick={clearFilters}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <UsersIcon className="mb-4 h-12 w-12 text-muted-foreground/50"/>
                            <p className="text-lg font-medium text-muted-foreground">
                                No users found
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters'
                                    : 'No users in the system yet'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className={user.isDeleted ? 'opacity-60' : ''}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                                                </div>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                            >
                                                {user.role === 'ADMIN' && (
                                                    <Shield className="mr-1 h-3 w-3"/>
                                                )}
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.isDeleted ? 'destructive' : 'outline'}
                                                className={
                                                    !user.isDeleted
                                                        ? 'border-emerald-500 text-emerald-600'
                                                        : ''
                                                }
                                            >
                                                {user.isDeleted ? (
                                                    <>
                                                        <UserX className="mr-1 h-3 w-3"/>
                                                        Inactive
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="mr-1 h-3 w-3"/>
                                                        Active
                                                    </>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.createdAt
                                                ? format(new Date(user.createdAt), 'MMM d, yyyy')
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {user.id !== currentUser?.id && (
                                                <Button
                                                    variant={user.isDeleted ? 'default' : 'destructive'}
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsToggleDialogOpen(true);
                                                    }}
                                                    disabled={toggleStatusMutation.isPending}
                                                >
                                                    {user.isDeleted ? (
                                                        <>
                                                            <UserCheck className="mr-1 h-4 w-4"/>
                                                            Activate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserX className="mr-1 h-4 w-4"/>
                                                            Deactivate
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {meta && (
                <div className="flex justify-end pt-4">
                    <AppPagination
                        page={page}
                        totalPages={meta.total / limit}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* Toggle Status Dialog */}
            <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedUser?.isDeleted ? 'Activate User' : 'Deactivate User'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser?.isDeleted
                                ? `Are you sure you want to activate "${selectedUser?.name}"? They will be able to access the system again.`
                                : `Are you sure you want to deactivate "${selectedUser?.name}"? They will no longer be able to access the system.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleStatus}
                            className={
                                selectedUser?.isDeleted
                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                    : ''
                            }
                        >
                            {toggleStatusMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            ) : null}
                            {selectedUser?.isDeleted ? 'Activate' : 'Deactivate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Users;
