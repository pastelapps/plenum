import { getCompanySettings } from '@/lib/queries/company';
import CompanySettingsForm from '@/components/admin/CompanySettingsForm';

export default async function AdminConfigPage() {
  const company = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">
          Dados da empresa compartilhados entre todos os cursos.
        </p>
      </div>

      <CompanySettingsForm company={company} />
    </div>
  );
}
