import {EmergencyService} from '@/components/emergency-service';
import {PageShell} from '@/components/page-shell';
import {VacationOverview} from '@/components/vacation-overview';
import {getTranslator} from '@/lib/i18n';

/**
 * /urlaubszeiten — ausschliesslich zeitkritische Betriebsinformationen:
 * Urlaubszeiten samt Vertretung und die Nummern fuer Zeiten ausserhalb der
 * Sprechstunde. Hiess bis September 2026 /schliesszeiten; die Praxis nennt
 * es Urlaub, also heisst es hier auch so — Route, Titel und Navigation. Bewusst kein Praxis-Blog: ein veralteter Beitrag wuerde die
 * einzige wirklich wichtige Information verdecken.
 *
 * Kein Hinweisband auf dieser Seite — die Vollansicht steht direkt darunter,
 * ein Band waere ein Link auf die eigene Seite.
 */
export function ClosuresPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="closures">
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('closures.eyebrow')}</p>
          <h1 className="page-hero__title">{t('closures.title')}</h1>
          <p className="page-hero__lead">{t('closures.lead')}</p>
        </div>
      </section>

      <VacationOverview />

      {/* Danach kommt nichts mehr. Bis September 2026 schloss die Seite mit
          einem Abschnitt "Sprechzeiten ausserhalb der Urlaubszeiten", der auf
          die Kontaktseite verwies. Die Praxis hat ihn gestrichen (Screenshot
          vom 07.09.2026, Ueberschrift, Satz und Link komplett markiert): auf
          einer Seite ueber Schliesszeiten sind die regulaeren Sprechzeiten ein
          Nebenschauplatz, und die Hauptnavigation fuehrt ohnehin dorthin. */}
      <EmergencyService />
    </PageShell>
  );
}
