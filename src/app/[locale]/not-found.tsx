"use client";

import Link from "@/components/i18n/LocaleLink";
import PageHeader from "@/components/ui/PageHeader";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <PageHeader eyebrow="404" title={t.notFound.title} intro={t.notFound.intro}>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-dark">{t.notFound.home}</Link>
        <Link href="/treatments" className="btn btn-outline">{t.nav.treatments}</Link>
      </div>
    </PageHeader>
  );
}
