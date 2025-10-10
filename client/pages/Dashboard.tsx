import { useEffect, useState } from "react";

interface UserPayload {
  email: string;
  role?: string;
  [k: string]: any;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user as UserPayload);
        } else {
          window.location.href = "http://localhost:4001";
        }
      } catch {
        window.location.href = "http://localhost:4001";
      }
    })();
  }, []);

  if (!user) return <p>Yükleniyor…</p>;
  return <div style={{ padding: 24 }}>Merhaba, {user.email}</div>;
}
