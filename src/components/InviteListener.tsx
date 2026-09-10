"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSocket } from "@/lib/socketClient";

interface Invite {
  code: string;
  fromDisplayName: string;
}

export default function InviteListener() {
  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    const socket = getSocket();
    function onInvite(data: Invite) {
      setInvite(data);
    }
    socket.on("game_invite", onInvite);
    return () => {
      socket.off("game_invite", onInvite);
    };
  }, []);

  if (!invite) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 card !p-4 max-w-xs shadow-lg animate-pop flex flex-col gap-2">
      <p className="font-bold">
        🎮 {invite.fromDisplayName} nodigt je uit voor een live spel!
      </p>
      <div className="flex gap-2">
        <Link href={`/live/${invite.code}`} className="btn-primary !px-3 !py-1.5 flex-1" onClick={() => setInvite(null)}>
          Meedoen
        </Link>
        <button className="btn-secondary !px-3 !py-1.5" onClick={() => setInvite(null)}>
          Later
        </button>
      </div>
    </div>
  );
}
