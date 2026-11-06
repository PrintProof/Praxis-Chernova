import {onlineReception} from '@/content/practice';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'arzt-direkt-online-rezeption': {'instance-id': string};
    }
  }
}

/**
 * Online-Rezeption von arzt-direkt — schwebendes Widget, das das Skript des
 * Anbieters selbst zeichnet. Auf Wunsch der Praxis (November 2026) die
 * EINZIGE bewusste Ausnahme von "keine externen Anfragen, kein Fremd-JS":
 * Skript, Schriften und Einstellungen kommen beim Seitenaufruf von
 * arzt-direkt. Die Datenschutzerklaerung (content/legal.ts) nennt das; wer
 * hier etwas aendert, muss dort nachziehen.
 *
 * Damit das Widget nicht nur eine Fehlermeldung zeigt, muss die Domain der
 * Website bei arzt-direkt als erlaubter Ursprung eingetragen sein.
 */
export function OnlineReception() {
  return (
    <>
      <script src={onlineReception.scriptUrl} async />
      <arzt-direkt-online-rezeption instance-id={onlineReception.instanceId} />
    </>
  );
}
