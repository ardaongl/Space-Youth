import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/me", { credentials: "include" });
        if (res.ok) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "http://localhost:4001";
        }
      } catch {
        window.location.href = "http://localhost:4001";
      }
    })();
  }, []);
  return <p>Yönlendiriliyor…</p>;
}
