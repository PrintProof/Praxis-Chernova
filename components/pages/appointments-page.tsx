import {AlertCircle, Calendar, HouseCall, Mask, Phone, Video} from '@/components/illustrations';
import {NextVacationBanner} from '@/components/next-vacation-banner';
import {PageShell} from '@/components/page-shell';
import {PhoneSentence} from '@/components/phone-sentence';
import {Section} from '@/components/section';
import {practice} from '@/content/practice';
import {getTranslator} from '@/lib/i18n';

/**
 * /termine — alles, was mit einem Besuch in der Praxis zu tun hat.
 *
 * Zusammengezogen aus drei fruher verstreuten Orten: dem Abschnitt "Termin
 * vereinbaren" der Startseite, dem Block "Termin vereinbaren" auf /leistungen
 * und der Zeile "Termine" unter "Organisatorisches" auf /kontakt. Genau diese
 * Verteilung hat die Praxis als unuebersichtlich kritisiert.
 *
 * Reihenfolge folgt dem Ablauf einer Patientin:
 *   1. Wie bekomme ich einen Termin?   (zwei Wege mit Uhrzeit)
 *   2. Geht es auch ohne herzukommen?  (Videosprechstunde)
 *   3. Was gilt beim Besuch?           (Terminpflicht, Maske)
 *   4. Und wenn ich nicht kommen kann? (Hausbesuche)
 */
export function AppointmentsPage() {
  const t = getTranslator();

  return (
    <PageShell routeKey="appointments" notice={<NextVacationBanner />}>
      <section className="page-hero page-hero--muted">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t('appointments.eyebrow')}</p>
          <h1 className="page-hero__title">{t('appointments.title')}</h1>
          <p className="page-hero__lead">{t('appointments.lead')}</p>
        </div>
      </section>

      {/* 1. Die beiden Wege. Traeger der Karten ist die UHRZEIT, nicht die
             Ueberschrift: wer die Seite ueberfliegt, sucht genau diese Zahl. */}
      <Section className="appointment-ways" title={t('appointments.waysTitle')}>
        <div className="appointment-ways__grid">
          <article className="way">
            <p className="way__head">
              <Calendar className="icon way__icon" />
              <span className="way__title">{t('appointments.onlineTitle')}</span>
            </p>
            <p className="way__when">{t('appointments.onlineWhen')}</p>
            <p className="way__scope">{t('appointments.forToday')}</p>
            <p className="way__body">{practice.appointments.onlineAudience}</p>
          </article>

          <article className="way">
            <p className="way__head">
              <Phone className="icon way__icon" />
              <span className="way__title">{t('appointments.phoneTitle')}</span>
            </p>
            <p className="way__when">{t('appointments.phoneWhen')}</p>
            <p className="way__scope">{t('appointments.forToday')}</p>
            <p className="way__body">
              <a className="way__phone" href={practice.phoneHref}>
                {practice.phone}
              </a>
            </p>
          </article>
        </div>

        {/* Massgeblich ist die APP-NUTZUNG, nicht "neu in der Praxis" — so von
            der Praxis ausdruecklich korrigiert. Das Zeitfenster steht hier
            nicht nochmal: es steht gross in der Telefon-Karte darueber. */}
        <PhoneSentence
          className="appointment-ways__fallback"
          text={practice.appointments.appOptOut}
          href={practice.phoneHref}
          display={practice.phone}
        />
      </Section>

      {/* 2. Videosprechstunde — bewusst KEINE dritte Karte neben den beiden
             Wegen: sie ist kein Weg, einen Termin zu bekommen, sondern eine
             Behandlungsform, die ueber genau dieselben zwei Wege vereinbart
             wird. Als gleichrangige Karte haette sie eine dritte Uhrzeit
             suggeriert, die es nicht gibt. */}
      <Section
        className="appointment-video"
        title={t('appointments.videoTitle')}
        tone="surface"
      >
        {/* Ohne eigene Ueberschrift: die traegt der Abschnitt darueber. Das
            Symbol bleibt als Schmuck, der Text steht daneben. */}
        <div className="way way--offer appointment-video__panel">
          <Video className="icon appointment-video__icon" />
          <p className="way__body">{practice.appointments.videoLine}</p>
        </div>
      </Section>

      {/* 3. Was beim Besuch gilt. Die Terminpflicht auf der reservierten
             Sandflaeche — sie ist der Hinweis, wegen dem sonst jemand
             vergeblich vor der Tuer steht. Der Hygienehinweis daneben
             bewusst ruhiger: zwei gleich laute Kaesten heben sich auf. */}
      <Section className="appointment-rules" titleHidden title={t('appointments.ruleTitle')}>
        <div className="callout appointment-rules__rule">
          <p className="callout__title">
            <AlertCircle className="icon icon--sm callout__icon" />
            <span>{t('appointments.ruleTitle')}</span>
          </p>
          <p className="callout__body">{practice.appointments.byAppointmentOnly}</p>
        </div>

        <div className="note appointment-rules__mask">
          <p className="note__title">
            <Mask className="icon note__icon" />
            <span>{t('appointments.maskTitle')}</span>
          </p>
          <p className="note__body">{practice.maskNote}</p>
          <p className="note__thanks">{t('appointments.thanks')}</p>
        </div>
      </Section>

      {/* 4. Hausbesuche — auf Wunsch der Praxis ein eigener Bereich. Sie
             gehoeren hierher und nicht unter "Kontakt": ein Hausbesuch ist
             eine Form, gesehen zu werden, keine Kontaktmoeglichkeit. */}
      <Section
        id="hausbesuche"
        className="appointment-housecalls"
        title={t('appointments.houseCallsTitle')}
        tone="muted"
      >
        {/* Ein Satz, kein Kasten: die Seite traegt bereits vier umrandete
            Bloecke, ein fuenfter machte sie zur Kaestchensammlung. Die
            Ueberschrift steht im Abschnittskopf. */}
        <p className="appointment-housecalls__line">
          <HouseCall className="icon appointment-housecalls__icon" />
          <span>{practice.houseCallsNote}</span>
        </p>
      </Section>
    </PageShell>
  );
}
