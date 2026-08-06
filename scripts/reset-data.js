import { rmSync } from "node:fs";
import { resolve } from "node:path";

for (const suffix of ["", "-shm", "-wal"]) {
  rmSync(resolve(process.cwd(), `data/tickets.sqlite${suffix}`), { force: true });
}

console.log("Dati locali rimossi. Il prossimo avvio ricreera' il seed.");
