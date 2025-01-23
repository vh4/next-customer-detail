'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
} from '@heroui/react';
import axios from 'axios';

export interface Transaction {
  id: number;
  productID: string;
  productName: string;
  amount: string;
  customerName: string;
  status: number;
  transactionDate: string;
  createBy: string;
  createOn: string;
}

interface TableTransaksiProps {
  transactions: Transaction[];
  fetchTransactions: () => void;
  onEdit: (transaction: Transaction) => void;
  loading: boolean;
}

export default function TableTransaksi({
  transactions,
  fetchTransactions,
  onEdit,
  loading,
}: TableTransaksiProps) {
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 4;

  // Always define hooks outside of conditionals
  const pages = Math.ceil(transactions.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return transactions.slice(start, end);
  }, [page, transactions]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`/api/transaksi/${id}`);
      fetchTransactions(); // Refresh the table after deletion
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  // Avoid early return that skips hook calls
  if (loading) {
    return (
      <div>
        {Array.from({ length: rowsPerPage }).map((_, index) => (
          <div
            key={index}
            className="h-10 bg-gray-200 animate-pulse rounded mb-2"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <Table
      aria-label="Transaction Table"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: 'min-h-[222px]',
      }}
    >
      <TableHeader>
        <TableColumn key="productName">PRODUCT NAME</TableColumn>
        <TableColumn key="amount">AMOUNT</TableColumn>
        <TableColumn key="customerName">CUSTOMER</TableColumn>
        <TableColumn key="status">STATUS</TableColumn>
        <TableColumn key="actions">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === 'actions' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : columnKey === 'status' ? (
                  item.status === 1 ? 'Completed' : 'Pending'
                ) : (
                  (item as any)[columnKey]
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
