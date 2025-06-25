// src/services/storageService.js

export function exportGame(store: any) {
  const dataStr = JSON.stringify(store, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "partie-ecologie.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importGame(event: any, store: any) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      Object.assign(store, data);
    } catch {
      alert("Fichier invalide !");
    }
  };
  reader.readAsText(file);
}
