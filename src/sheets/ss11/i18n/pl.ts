import type { Dict } from './en';

export const pl: Dict = {
  title: 'Vorax — Ściąga',
  desc: 'Vorax w SS14: jak liczy się wynik Surgical Preparation, który instrument brać pierwszy, progi fiolek, który compass się opłaca i jak działa Grafting.',
  back: 'Wszystkie wydarzenia',
  h1: 'Vorax',
  lead: 'Wszedł z **SS11** (styczeń 2026) i wciąż jest w grze. Zasady z naszego researchu SS11; farma i strategia na **SS14 Tartarus**.',
  tags: { o: 'w grze', p: 'gracze', c: 'deklaracja' },
  tagsH: 'Skąd jest każda linijka',

  loopH: 'Jak działa Vorax',
  steps: [
    {
      h: 'Zbieraj',
      p: 'Zabijaj karmazynowe **Vorax Elites** na mapach Netherrealm: wypada z nich **Vorax Substance**. **{a}** rozpoczyna jedną Surgical Preparation; możesz trzymać do **{b}**.',
    },
    {
      h: 'Przygotuj',
      p: '**Surgical Preparation** w klinice Shelley: **6 zbiorników** z grupami potworów, **13 rund**. Wynik, **Ultimate Activity**, to Activity × Quantity zsumowane z 6 zbiorników.',
    },
    {
      h: 'Walcz',
      p: 'W **Operating Theater** twoje grupy przychodzą falami. Końcowy wynik barwi **6 Antidote Vials**: biała → fioletowa → czerwona i jedna tęczowa.',
    },
    {
      h: 'Wszczepiaj',
      p: 'Łup zasila **Grafting** na Vorax Gear: organy i szwy dodają afiksy wzięte z innych przedmiotów.',
    },
  ],
  rulesH: 'Zasady, które decydują o runie',
  rules: {
    rounds: 'Rundy 1–10: zagraj 1 z 3 mikstur. Rundy 11–13: bez mikstur, instrumenty działają same.',
    instruments:
      'Instrumenty: jeden w rundzie 1, kolejny przy **{a}** i przy **{b}** Ultimate Activity — nie zabierają rundy.',
    refresh: '**3** odświeżenia mikstur na run; Intern Shelley dodaje do **2** odświeżeń instrumentów.',
    abandon: '!!Porzucenie przed walką kasuje Substance.!! Po tęczy porzuć, żeby odebrać nagrodę.',
    risk: 'Surgical Risk niski / średni / wysoki: +5 / 10 / 20% Activity za zabójstwo, −1 / 2 / 5% Ultimate Activity za śmierć.',
  },

  winH: 'Wygraj przygotowanie',
  firstH: 'Pierwszy instrument',
  patternsH: 'Wzorce',
  patterns: {
    fuse: '**Dodawaj, potem łącz:** ciągle dodawaj potwory, zrób z nich kilka ogromnych grup i ładuj w nie Quantity i Activity.',
    pests: '**Pest to pewna droga:** zrób wcześnie 2 grupy Pest i nie łącz ich ani nie mutuj.',
    tank: '**Zostaw jeden wolny zbiornik:** dodanie przy 6 pełnych zbiornikach się nie udaje i nic nie uruchamia.',
    kit: '**Otwórz Potion Kit zamiast odświeżać:** nowy wybór, a odświeżenie zostaje.',
    xeno: '**Xenopanacea** (+333 Activity albo Quantity, zmienia potwora w Aemberona): mocna na największej grupie, słaba na małej.',
    aim: '**Celuj w {a} przed walką:** bonus z bitwy zwykle doprowadza do tęczy.',
  },
  practice: 'Przećwicz planszę w Vorax Simulatorze społeczności',

  vialsH: 'Co daje wynik',
  vialCols: ['Ultimate Activity', 'Fiolki'],
  vials: {
    purple1: 'pierwsza fioletowa',
    red1: 'pierwsza czerwona',
    red4: 'czerwone 4, 5 i 6',
    rainbow: 'tęczowa (tylko jedna fiolka)',
  },
  vialsNote:
    'Fioletowe 2–6 i czerwone 2–3 wypadają pomiędzy (niepotwierdzone w grze). Powyżej tęczy większy wynik nic już nie daje.',

  farmH: 'Farma w SS14',
  compassH: 'Compasses',
  compass: {
    blue: 'grupy Vorax na mapie; potwory +10% życia.',
    purple: '+30% życia; każda oczyszczona grupa Vorax przyzywa Scavengera: +8% ilości fiolek za każdego.',
    gold: '+70% życia; więcej dropów Surgical Protocol, +2 Rare Protocols; Severe Symptoms.',
  },
  colours: { blue: 'niebieski', purple: 'fioletowy', gold: 'złoty' },
  tierP:
    'Według trudności: **T8** niebieski · **Profound** niebieski lub fioletowy · **Deep Space** fioletowy lub złoty — złoty tylko z mocną Intern Shelley i wprawą.',
  farm: {
    price:
      '!!Najpierw sprawdź cenę compassa.!! Run ze złotym dawał 2500–3000 FE/h w dniach 3–5, a potem tracił 50–150 FE na run, gdy compass kosztował już 50–60 FE (serwer chiński, jeden gracz).',
    rainbow:
      'Fioletowy zwraca około 180 FE na run, złoty 300+ — oba są na minusie, gdy run nie dojdzie do tęczy (komentarz z serwera chińskiego).',
    stack: 'Gracze łączą go na tej samej mapie z Sandlordem i innymi szybkimi mechanikami.',
    chimera: '**Illusory Chimera** (buty) wypada tylko z Vorax, od **Timemark 8**.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Każdy drop Antidote Vial ma od **18%** (poz. 1) do **28%** (poz. 6) szansy na podwojenie; na poz. 6 daje też +2 odświeżenia instrumentów i 20% szansy, że fiolka otworzy się ponownie.',

  graftH: 'Grafting w skrócie',
  graft: {
    one: '**Jeden** element Vorax Gear naraz: do 2 afiksów Advanced, 2 Ultimate i 2 Legendary, bez wymagań atrybutów.',
    normal: '**Normal Organs** → afiksy Basic/Advanced: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → afiksy Ultimate, na przedmiotach od poziomu 89.',
    core: '**Core Organ + Suture** → afiks Legendary: Sullied do Fine, Tenacious do Fine/Precious, Exquisite do Matchless/Ultimate.',
    ss14: 'SS14: rozebranie Ultimate Legendary daje **1 Core Organ**; cztery Core Organs wymagają 20 Exquisite Sutures (od SS13).',
  },
  gapsH: 'Jeszcze nie wiadomo',
  gapsP: 'Pośrednie progi fiolek, szanse na drop Substance i organów oraz FE/h zmierzone na serwerze globalnym.',
};
