from pathlib import Path
import json

root = Path(__file__).resolve().parent.parent
data = json.loads((root / "data/result.json").read_text(encoding="utf-8-sig"))
html = (root / "src/simulator.html").read_text(encoding="utf-8")
engine = (root / "src/simulator-engine.js").read_text(encoding="utf-8")
html = html.replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
html = html.replace("__ENGINE__", engine)
(root / "index.html").write_text(html, encoding="utf-8")
print(f"index.html generated ({len(html):,} characters)")
