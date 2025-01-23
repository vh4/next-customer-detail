'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@heroui/react';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import TableTransaksi, { type Transaction } from '../components/Table';
import DrawerTransaction from '../components/DrawerTransaksi';
import axios from 'axios';

export const TonyLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function Home() {
  const { data: session } = useSession();

  const [transactions, setTransactions] = useState<Transaction[]>([]); // Table data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get<Transaction[]>('/api/transaksi');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSave = async (data: Transaction | Omit<Transaction, 'id'>) => {
    try {
      if ('id' in data && data.id) {
        // Update existing transaction
        await axios.post(`/api/transaksi/${data.id}`, data);
      } else {
        // Add new transaction
        const newTransaction = {
          ...data,
          createBy: session?.user?.name || 'Anonymous',
          status: 0,
          productID: `${Date.now()}-${Math.random()}`, // Generate unique product ID
        };
        await axios.post('/api/transaksi', newTransaction);
      }
      await fetchTransactions(); // Refresh the table
      setDrawerOpen(false); // Close the drawer
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setSelectedTransaction(null);
    setDrawerOpen(true);
  };

  useEffect(() => {
    fetchTransactions(); // Initial fetch
  }, []);

  return (
    <div>
      <Navbar className="bg-gray-100">
        <NavbarBrand>
          <TonyLogo />
          <p className="font-bold text-inherit">Vh4 Inc</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="#">{session?.user?.name || 'Guest'}</Link>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="#"
              variant="flat"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="content container mx-auto mt-12">
        <div className="w-[900px] mx-auto">
          <Button
            className="mb-4"
            color="success"
            onClick={handleAdd} // Open drawer to add new transaction
          >
            Add Transaction
          </Button>
          <TableTransaksi
            transactions={transactions}
            fetchTransactions={fetchTransactions}
            onEdit={handleEdit}
            loading={loading}
          />
          <DrawerTransaction
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            transaction={selectedTransaction}
            onSave={handleSave} // Use handleSave to handle both add and edit
          />
        </div>
      </div>
    </div>
  );
}
