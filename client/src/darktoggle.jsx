import { useState, useEffect } from "react";

const DarkToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-1 border rounded"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default DarkToggle;