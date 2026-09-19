"use client";

import { useEffect, useRef, useState } from "react";

interface BrandingView {
  logoDataUrl: string | null;
  heroLogoDataUrl: string | null;
  faviconDataUrl: string | null;
  appName: string | null;
}

// PNG (niet JPEG) om transparantie in een logo/favicon te behouden.
function resizeToDataUrl(file: File, maxDimension: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Kon het bestand niet lezen."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Ongeldige afbeelding."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function ImageSlot({
  label,
  description,
  value,
  maxDimension,
  previewClassName,
  onChange,
}: {
  label: string;
  description: string;
  value: string | null;
  maxDimension: number;
  previewClassName: string;
  onChange: (dataUrl: string | null) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    // file.type is bij .ico-bestanden vaak een lege string (browsers/OS'en
    // registreren dat mimetype niet altijd), dus val bij twijfel terug op de
    // bestandsextensie in plaats van de upload stilzwijgend te negeren.
    const looksLikeImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|svg|ico)$/i.test(file.name);
    if (!looksLikeImage) {
      setError("Kies een afbeeldingsbestand (PNG, JPEG, WebP, SVG of ICO).");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await resizeToDataUrl(file, maxDimension);
      await onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon de afbeelding niet verwerken.");
    }
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    setError(null);
    await onChange(null);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-sm dark:text-slate-100">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${previewClassName}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">geen</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <button className="btn-secondary !px-3 !py-1.5 !text-xs self-start" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? "Bezig..." : value ? "Vervangen" : "Uploaden"}
          </button>
          {value && (
            <button className="text-xs text-red-500 hover:underline self-start" disabled={busy} onClick={remove}>
              Verwijderen
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default function AdminBrandingClient() {
  const [branding, setBranding] = useState<BrandingView | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [appNameInput, setAppNameInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/branding")
      .then((r) => r.json())
      .then((b: BrandingView) => {
        setBranding(b);
        setAppNameInput(b.appName ?? "");
      });
  }, []);

  async function save(patch: Partial<BrandingView>) {
    setSavedMessage(null);
    const res = await fetch("/api/admin/branding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setBranding(await res.json());
      setSavedMessage("Opgeslagen — ververs de pagina om het overal te zien.");
    }
  }

  if (!branding) return <p className="text-slate-400 dark:text-slate-500">Laden...</p>;

  return (
    <details className="group card flex flex-col gap-4">
      <summary className="font-extrabold cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
        Huisstijl
        <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Header-logo en welkomscherm-logo zijn los van elkaar in te stellen — vaak is de header-versie
        klein en naast tekst, terwijl een welkomscherm-logo groot en alleenstaand staat.
      </p>

      <div className="flex flex-col gap-2">
        <p className="font-bold text-sm dark:text-slate-100">App-naam</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tekst die getoond wordt zolang er geen logo is ingesteld op de bijbehorende plek (header,
          welkomscherm), en altijd voor de browsertab/paginatitel (kan geen afbeelding zijn). Leeg
          laten = standaardnaam &ldquo;Jehova&rdquo;.
        </p>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            save({ appName: appNameInput || null });
          }}
        >
          <input
            type="text"
            className="input !py-2 max-w-xs"
            maxLength={40}
            placeholder="Jehova"
            value={appNameInput}
            onChange={(e) => setAppNameInput(e.target.value)}
          />
          <button type="submit" className="btn-secondary !px-3 !py-1.5 !text-xs">
            Opslaan
          </button>
        </form>
      </div>

      <ImageSlot
        label="Logo (header)"
        description="Vervangt 📖 + de app-naam in de header. Werkt het best met een transparante achtergrond."
        value={branding.logoDataUrl}
        maxDimension={512}
        previewClassName="h-12 w-32 px-2"
        onChange={(logoDataUrl) => save({ logoDataUrl })}
      />

      <ImageSlot
        label="Logo (welkomscherm)"
        description="Los van het header-logo hierboven — vervangt de app-naam boven de titel op het welkomscherm. Optioneel: laat leeg om daar de tekstnaam te tonen."
        value={branding.heroLogoDataUrl}
        maxDimension={800}
        previewClassName="h-16 w-48 px-2"
        onChange={(heroLogoDataUrl) => save({ heroLogoDataUrl })}
      />

      <ImageSlot
        label="Favicon"
        description="Het icoontje in het browsertabblad."
        value={branding.faviconDataUrl}
        maxDimension={256}
        previewClassName="h-12 w-12"
        onChange={(faviconDataUrl) => save({ faviconDataUrl })}
      />

      {savedMessage && <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">{savedMessage}</p>}
    </details>
  );
}
