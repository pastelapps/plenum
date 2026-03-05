'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Plus, Trash2 } from 'lucide-react';
import { updateCompanySettings } from '@/lib/actions/company';
import type { CompanySettings, PhoneEntry, EmailEntry } from '@/types/company';

interface Props {
  company: CompanySettings;
}

export default function CompanySettingsForm({ company }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [companyName, setCompanyName] = useState(company.company_name);
  const [address, setAddress] = useState(company.address || '');
  const [website, setWebsite] = useState(company.website || '');
  const [cancellationPolicy, setCancellationPolicy] = useState(company.cancellation_policy || '');
  const [logoUrl, setLogoUrl] = useState(company.logo_url || '');
  const [logoDarkUrl, setLogoDarkUrl] = useState(company.logo_dark_url || '');
  const [phones, setPhones] = useState<PhoneEntry[]>(company.phones || []);
  const [emails, setEmails] = useState<EmailEntry[]>(company.emails || []);

  const addPhone = () => setPhones([...phones, { label: '', number: '' }]);
  const removePhone = (i: number) => setPhones(phones.filter((_, idx) => idx !== i));
  const updatePhone = (i: number, field: keyof PhoneEntry, value: string) => {
    const updated = [...phones];
    updated[i] = { ...updated[i], [field]: value };
    setPhones(updated);
  };

  const addEmail = () => setEmails([...emails, { label: '', email: '' }]);
  const removeEmail = (i: number) => setEmails(emails.filter((_, idx) => idx !== i));
  const updateEmail = (i: number, field: keyof EmailEntry, value: string) => {
    const updated = [...emails];
    updated[i] = { ...updated[i], [field]: value };
    setEmails(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const result = await updateCompanySettings({
      company_name: companyName,
      address: address || null,
      website: website || null,
      cancellation_policy: cancellationPolicy || null,
      logo_url: logoUrl || null,
      logo_dark_url: logoDarkUrl || null,
      phones,
      emails,
    });

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      router.refresh();
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
          </div>
        </CardContent>
      </Card>

      {/* Logos */}
      <Card>
        <CardHeader>
          <CardTitle>Logos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo (fundo escuro)</Label>
            <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="/logo.png" />
          </div>
          <div className="space-y-2">
            <Label>Logo (fundo claro)</Label>
            <Input value={logoDarkUrl} onChange={(e) => setLogoDarkUrl(e.target.value)} placeholder="/logo-dark.svg" />
          </div>
        </CardContent>
      </Card>

      {/* Phones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Telefones</CardTitle>
          <Button variant="outline" size="sm" onClick={addPhone}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {phones.map((phone, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={phone.label}
                onChange={(e) => updatePhone(i, 'label', e.target.value)}
                placeholder="Rótulo"
                className="w-32"
              />
              <Input
                value={phone.number}
                onChange={(e) => updatePhone(i, 'number', e.target.value)}
                placeholder="Número"
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removePhone(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          {phones.length === 0 && (
            <p className="text-sm text-gray-400">Nenhum telefone cadastrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Emails */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Emails</CardTitle>
          <Button variant="outline" size="sm" onClick={addEmail}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {emails.map((em, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={em.label}
                onChange={(e) => updateEmail(i, 'label', e.target.value)}
                placeholder="Rótulo"
                className="w-32"
              />
              <Input
                value={em.email}
                onChange={(e) => updateEmail(i, 'email', e.target.value)}
                placeholder="email@exemplo.com"
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeEmail(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          {emails.length === 0 && (
            <p className="text-sm text-gray-400">Nenhum email cadastrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Política de Cancelamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            rows={5}
            placeholder="Política de cancelamento..."
          />
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
