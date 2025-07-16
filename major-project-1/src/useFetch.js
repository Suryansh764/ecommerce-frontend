// useFetch.js
import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null); // default should NOT be undefined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json(); // <-- Important: parse JSON
      })
      .then((data) => {
        setData(data); // should be an array like [{ name: "Art", ... }]
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
