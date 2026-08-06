# Attivita' L30 - Proteggere il contratto della dashboard

## Prima di iniziare

Un test di caratterizzazione descrive un comportamento osservabile che il
sistema produce oggi. Serve a segnalare cambiamenti involontari durante un
intervento successivo; non dichiara che tutto il comportamento legacy sia
corretto.

Input disponibili:

- dashboard avviabile in locale;
- test API gia' verdi;
- tre test `TODO` essenziali e un quarto avanzato;
- funzioni pure per ricerca e contatori in `src/dashboard-model.js`.

Percorso essenziale:

- test API sull'ordine osservato dei ticket;
- test sulla ricerca indipendente da maiuscole e spazi esterni;
- test sui contatori con un elenco vuoto;
- una prova rosso -> verde;
- una misura informativa del caricamento, separata dai test funzionali.

Percorso avanzato, dopo i tre test essenziali:

- proteggere i campi dell'API realmente consumati dalla dashboard.

Errore da evitare: modificare il valore atteso solo per ottenere verde senza
prima osservare il comportamento reale.

## Avvio

```bash
pnpm install
pnpm reset
pnpm verify
pnpm dev
```

Apri <http://localhost:3001> e osserva:

- ordine dei ticket;
- campi realmente usati dalla tabella;
- ricerca per ID, titolo e cliente;
- contatori con elenco pieno e con input vuoto nel modello.

## Passaggi per risolvere l'esercizio

1. Apri i file in `tests/api/` e `tests/unit/`.
2. Scegli un comportamento osservato, non un dettaglio interno del codice.
3. Trasforma un `test.todo(...)` in un test eseguibile con un nome descrittivo.
4. Esegui `pnpm test` e correggi il test finche' descrive il comportamento
   corrente con un controllo specifico.
5. Completa i tre test essenziali. Se rimane tempo, affronta il test avanzato sui
   campi consumati dalla dashboard.
6. Introduci temporaneamente una piccola rottura nel comportamento protetto.
7. Esegui il test e verifica che diventi rosso per il motivo previsto.
8. Ripristina subito il codice e verifica di nuovo il verde.
9. Esegui `pnpm measure:dashboard` e leggi il tempo come osservazione, non come
   soglia del test. Non serve riportarlo in un documento.
10. Chiudi con `pnpm verify`.

## Vincoli

- non ottimizzare il caricamento;
- non cambiare la logica di produzione in modo permanente;
- non aggiungere dipendenze;
- non usare rete, provider o dati esterni;
- non controllare millisecondi nei test funzionali;
- non testare righe private se puoi osservare lo stesso contratto dall'esterno.

## Pronto quando

- i tre test essenziali partono verdi sul codice iniziale;
- almeno uno e' diventato rosso durante una rottura intenzionale;
- dopo il ripristino `pnpm verify` torna verde;
- i nomi descrivono comportamenti osservabili;
- la misura di performance resta separata dalla suite funzionale;
- nessuna ottimizzazione e' presente nel diff finale.
