import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BaccaratBetApp() {
  const [results, setResults] = useState([]);
  const [decision, setDecision] = useState("");

  const handleAddResult = (value) => {
    const updated = [...results, value.toLowerCase()].slice(-6);
    setResults(updated);
    evaluate(updated);
  };

  const evaluate = (recent) => {
    const last = recent[recent.length - 1];
    const countB = recent.filter((r) => r === "b").length;
    const countP = recent.filter((r) => r === "p").length;
    const hasT = recent.includes("t");

    if (hasT) return setDecision("관망 (T 이후)");
    if (recent.length < 6) return setDecision("데이터 부족");

    if (countB >= 4 && last === "p") return setDecision("관망 후 b 진입");
    if (countP >= 4 && last === "b") return setDecision("관망 후 b 진입");
    if (/b{3,}/.test(recent.join(""))) return setDecision("b 진입 유지");
    if (/b{5,}/.test(recent.join(""))) return setDecision("관망 (고점)");
    return setDecision("관망 유지");
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(console.error);
      });
    }
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Baccarat Flow AI</h1>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button onClick={() => handleAddResult("b")}>B</Button>
        <Button onClick={() => handleAddResult("p")}>P</Button>
        <Button onClick={() => handleAddResult("t")}>T</Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div>최근 결과: {results.join(" ").toUpperCase()}</div>
          <div className="text-lg font-semibold">진입 판단: {decision}</div>
        </CardContent>
      </Card>
    </div>
  );
}