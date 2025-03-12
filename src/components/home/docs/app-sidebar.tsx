'use client';

import * as React from 'react';
import { SquareTerminal } from 'lucide-react';

import { NavMain } from './nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { DocsService } from '@/lib/api';
import { DocumentPublic } from '@/client/docs';
import { VersionSwitcher } from './version-switcher';
import { SearchForm } from './search-form';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errorHandler';

const mockdata = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
};

async function FetchDocs() {
  let docs: DocumentPublic[] | null = null;
  try {
    const response = await DocsService.docsReadPublicDocs();
    docs = response.data;
  } catch (err) {
    handleApiError(err, (message) => toast.error(message.title));
  }
  return docs;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [docs, setDocs] = React.useState<DocumentPublic[] | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const fetchedDocs = await FetchDocs();
      setDocs(fetchedDocs);
    }
    fetchData();
  }, []);

  const categorizedDocs =
    docs?.reduce((acc: Record<string, Record<string, DocumentPublic[]>>, doc: DocumentPublic) => {
      const category = doc.category?.name || 'Uncategorized';
      const subcategory = doc.subcategory?.name || 'General';

      if (!acc[category]) acc[category] = {};
      if (!acc[category][subcategory]) acc[category][subcategory] = [];

      acc[category][subcategory].push(doc);

      return acc;
    }, {}) || {};

  const data = {
    navMain: Object.keys(categorizedDocs).map((category) => ({
      title: category,
      url: `#${category}`,
      icon: SquareTerminal,
      subcategories: Object.keys(categorizedDocs[category]).map(
        (subcategory) => ({
          title: subcategory,
          url: `#${subcategory}`,
          items: categorizedDocs[category][subcategory].map(
            (doc: DocumentPublic) => ({
              title: doc.title,
              url: `/docs?docId=${doc.title}`,
            }),
          ),
        }),
      ),
    })),
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={mockdata.versions}
          defaultVersion={mockdata.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain categories={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
