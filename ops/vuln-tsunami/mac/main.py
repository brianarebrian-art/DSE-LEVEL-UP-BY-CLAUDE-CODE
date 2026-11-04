#!/usr/bin/env python3
"""
DSE Level Up — Vulnerability Tsunami Mac agent (MenuBar)
No emoji icons (project rule). Uses text label "VT".

Optional: pip install rumps
"""

from __future__ import annotations

import json
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DASHBOARD = "http://127.0.0.1:3005"
LOG_PATH = ROOT / "vulntsunami.log"
TRANSLATE_API = "https://api.mymemory.translated.net/get?q={q}&langpair=en|zh-TW"


def translate_to_zh(text: str, cve_id: str = "") -> str:
    """Sync translate — append ZH: CVE-xxx -> 中文... to vulntsunami.log"""
    q = urllib.parse.quote(text[:450])
    url = TRANSLATE_API.format(q=q)
    with urllib.request.urlopen(url, timeout=20) as res:
        data = json.loads(res.read().decode("utf-8"))
    zh = (data.get("responseData") or {}).get("translatedText") or ""
    prefix = cve_id or "CVE"
    line = f"ZH: {prefix} -> {zh[:200]}\n"
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(line)
    return zh


def open_dashboard() -> None:
    subprocess.run(["open", DASHBOARD], check=False)


def open_log() -> None:
    LOG_PATH.touch(exist_ok=True)
    r = subprocess.run(["open", "-a", "Console", str(LOG_PATH)], check=False)
    if r.returncode != 0:
        subprocess.run(["open", "-t", str(LOG_PATH)], check=False)


def refresh() -> None:
    req = urllib.request.Request(
        f"{DASHBOARD}/api/refresh",
        data=b"{}",
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as res:
        res.read()


def notify(title: str, body: str) -> None:
    script = f'display notification {json.dumps(body)} with title {json.dumps(title)}'
    subprocess.run(["osascript", "-e", script], check=False)


def run_rumps() -> None:
    import rumps  # type: ignore

    class VulnTsunamiApp(rumps.App):
        def __init__(self) -> None:
            super().__init__("VT", quit_button="Quit VT")

        @rumps.clicked("Refresh")
        def on_refresh(self, _):  # noqa: ANN001
            try:
                refresh()
                notify("Vuln Tsunami", "Refresh done")
            except Exception as exc:  # noqa: BLE001
                notify("Vuln Tsunami", f"Refresh failed: {exc}")

        @rumps.clicked("Open Dashboard")
        def on_dash(self, _):  # noqa: ANN001
            open_dashboard()

        @rumps.clicked("Open Log")
        def on_log(self, _):  # noqa: ANN001
            open_log()

    VulnTsunamiApp().run()


def main() -> int:
    if len(sys.argv) > 1 and sys.argv[1] == "translate":
        cve = sys.argv[2] if len(sys.argv) > 2 else ""
        text = " ".join(sys.argv[3:]) if len(sys.argv) > 3 else "test"
        print(translate_to_zh(text, cve))
        return 0
    try:
        run_rumps()
    except ImportError:
        print("rumps not installed. CLI: 1=Refresh 2=Dashboard 3=Log q=quit")
        while True:
            choice = input("> ").strip()
            if choice == "1":
                refresh()
            elif choice == "2":
                open_dashboard()
            elif choice == "3":
                open_log()
            elif choice.lower() == "q":
                break
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
