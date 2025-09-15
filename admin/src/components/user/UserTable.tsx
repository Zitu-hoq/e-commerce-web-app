import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTable({ users }) {
  console.log(users);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-center">Total Orders</TableHead>
          <TableHead className="text-right">Current Orders</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="italic">{user.email}</TableCell>
            <TableCell className="italic">{user.phone}</TableCell>
            <TableCell className="font-bold text-base text-center">
              {user.totalOrders}
            </TableCell>
            <TableCell className="text-right font-bold text-base text-green-500">
              {user.currentOrdersCount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
