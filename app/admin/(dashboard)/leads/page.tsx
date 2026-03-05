import { createClient } from '@/lib/supabase/server';
import { getAllCourses } from '@/lib/queries/courses';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formTypeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  folder: { label: 'Folder', variant: 'default' },
  in_company: { label: 'In Company', variant: 'secondary' },
  notification: { label: 'Notificação', variant: 'outline' },
};

interface LeadRow {
  id: string;
  course_id: string | null;
  form_type: string;
  nome: string;
  email: string | null;
  whatsapp: string | null;
  estado: string | null;
  cidade: string | null;
  orgao: string | null;
  created_at: string;
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data: leadsData } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  const leads = (leadsData || []) as unknown as LeadRow[];
  const courses = await getAllCourses();

  const courseMap = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">
          {leads.length} lead{leads.length !== 1 ? 's' : ''} capturado{leads.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Nenhum lead capturado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>UF</TableHead>
                    <TableHead>Órgão</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const ft = formTypeMap[lead.form_type] || formTypeMap.folder;
                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.nome}</TableCell>
                        <TableCell className="text-sm">{lead.email || '—'}</TableCell>
                        <TableCell className="text-sm">{lead.whatsapp || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={ft.variant}>{ft.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[150px] truncate">
                          {lead.course_id ? (courseMap.get(lead.course_id) || lead.course_id) : '—'}
                        </TableCell>
                        <TableCell className="text-sm">{lead.estado || '—'}</TableCell>
                        <TableCell className="text-sm">{lead.orgao || '—'}</TableCell>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
