# Hvordan bidra til prosjektet

## Branch-navn

Språk: norsk

Alle branch-navn skal starte med et tall for hvilke utviklingsoppgave de hører til.  
Tallet etterfølges av tittelen på utviklingsoppgaven, med utelukkende små bokstaver og bindestrek erstatter mellomrom.

### Eksempel

```
1-sette-opp-react-prosjekt
```

## Commit-meldinger

Språk: engelsk

Alle commit-meldinger skal følge vår tilpassede standard basert på [conventionalcommits.org v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

**Standard-melding**  
Strukurene vi bruker baserer seg på &lt;type>(optional scope)/#&lt;issue>: &lt;description>

&lt;type>: feat (ny / endret funksjonalitet)/chore (endringer som ikke fører til direkte synlige resultater til en brukerhistorie)/fix (rettelse av en feil)

&lt;issue>: id'en til utviklingsoppgaven

&lt;description>: beskrivelse av innholdet i commiten

### Eksempler

```
feat/#1: initialize react project
```

```
feat(navbar)/#2: implement navigation bar
```

```
chore/#3: write tests for navigation component
```

```
fix/#4: resolve design bug

This commit resolves the bug where users were able to login as any user.
```

## Merge-forespørsler

Når en har kode i en separat gren av kodebasen må det sendes i en merge-forespørsel for å bli en del av hoved-grenen.

Før den kan bli inkludert må den være godkjent av to (2) gruppemedlemmer og alle tester må være godkjent.
