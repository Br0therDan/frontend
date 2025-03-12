'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/components/data_table/DataTable';
import { DocsService } from '@/lib/api';
import React from 'react';
import { handleApiError } from '@/lib/errorHandler';
import { toast } from 'sonner';
import Loading from '@/components/common/Loading';
import { DocumentPublic } from '@/client/docs';
import { columns } from './columns';
import Navbar from '@/components/common/Navbar';
import DocsForm from './DocsForm';

export default function DocsTable() {
  const [docs, setDocs] = useState<DocumentPublic[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingDoc, setEditingDoc] = useState<DocumentPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const response = await DocsService.docsReadDocs();
        setDocs(response.data);
      } catch (err) {
        handleApiError(err, (message) => toast.error(message.title));
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [toast]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-2">
      <Navbar type="Document" addModalAs={DocsForm} />
      <DataTable columns={columns} data={docs} />
      {isAdding && (
        <DocsForm
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          mode={'add'}
        />
      )}

      {editingDoc && (
        <DocsForm
          isOpen={true}
          onClose={() => setEditingDoc(null)}
          mode={'edit'}
          initialData={editingDoc}
        />
      )}
    </div>
  );
}
