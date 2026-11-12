import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { Card } from '../components/ui';
import { btn } from '../components/styles';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <Card className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold text-slate-900">{t('notFound.title')}</h1>
      <Link to="/" className={`${btn.primary} mt-6`}>{t('notFound.back')}</Link>
    </Card>
  );
}
