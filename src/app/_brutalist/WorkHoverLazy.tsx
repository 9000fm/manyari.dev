"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMountOnInteraction } from "./useMountOnInteraction";

const WorkHover = dynamic(() => import("./WorkHover"), { ssr: false });

// Keep the preview deferred, but preserve the first tap while its chunk loads.
export default function WorkHoverLazy() {
  const ready = useMountOnInteraction();
  const [tapRequest, setTapRequest] = useState<{ slug: string; id: number } | null>(null);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (matchMedia("(min-width:900px) and (hover:hover) and (pointer:fine)").matches) return;
      const target = event.target instanceof Element ? event.target : null;
      const row = target?.closest<HTMLLIElement>(".brutWork > li");
      if (!row) return;
      if (target?.closest("a") && !target.closest(".brutPlate a")) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setTapRequest(previous => ({ slug: row.id.replace("project-", ""), id: (previous?.id ?? 0) + 1 }));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return ready || tapRequest ? <WorkHover tapRequest={tapRequest} /> : null;
}
