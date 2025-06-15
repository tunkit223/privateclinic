"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchData } from "./searchData"; // Đảm bảo file này chứa danh sách các trang & từ khóa

interface GlobalSearchProps {
  accountId: string;
}

export default function GlobalSearch({ accountId }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof searchData>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.keywords.some((k) => k.toLowerCase().includes(lower))
    );

    setSuggestions(filtered);
  }, [query]);

  const handleSelect = (path: string) => {
    router.push(`/${accountId}${path}`);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Search..."
      />

      {suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow z-10 max-h-80 overflow-y-auto">
          {suggestions.map((item, index) => {
            const displayedKeywords = item.keywords.slice(0, 5).join(", ");
            const moreKeywords = item.keywords.length > 5 ? "..." : "";
            const fullKeywordList = item.keywords.join(", ");

            return (
              <div
                key={index}
                className="p-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleSelect(item.path)}
              >
                <div className="font-medium text-blue-600">{item.title}</div>
                <div
                  className="text-xs text-gray-500"
                  title={fullKeywordList}
                >
                  Key Words: {displayedKeywords} {moreKeywords}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
