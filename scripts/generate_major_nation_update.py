from __future__ import annotations

import csv
import datetime as dt
import json
import re
import time
import unicodedata
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path


ROOT = Path("/Users/noname/Documents/GuessXI World Cup")
PLAYERS_TS = ROOT / "lib" / "players.ts"
SQUAD_PDF = Path("/Users/noname/Downloads/SquadLists-English.pdf")
ADDITIONS_TS = ROOT / "lib" / "majorNationAdditions.ts"
ADDITIONS_REVIEW = ROOT / "data" / "major-nation-player-additions-review.csv"
NOT_PLAYABLE_REVIEW = ROOT / "data" / "major-nation-not-playable-review.csv"
SNAPSHOT_DATE = "2026-06-13"
TARGET_NATIONS = [
    "England",
    "Spain",
    "Germany",
    "Portugal",
    "France",
    "Argentina",
    "Brazil",
    "Scotland",
    "Canada",
    "United States",
]
USER_AGENT = "GuessXIWorldCupBot/1.0 (research contact: GuessXI@Proton.me)"
POSITION_MAP = {"GK": "Goalkeeper", "DF": "Defender", "MF": "Midfielder", "FW": "Forward"}
CLUB_COUNTRY_MAP = {
    "ALG": "Algeria",
    "ARG": "Argentina",
    "AUS": "Australia",
    "AUT": "Austria",
    "BEL": "Belgium",
    "BRA": "Brazil",
    "CAN": "Canada",
    "CHN": "China",
    "CRO": "Croatia",
    "DEN": "Denmark",
    "ENG": "England",
    "ESP": "Spain",
    "FRA": "France",
    "GER": "Germany",
    "GRE": "Greece",
    "HUN": "Hungary",
    "IRN": "Iran",
    "ISR": "Israel",
    "ITA": "Italy",
    "JPN": "Japan",
    "KOR": "South Korea",
    "KSA": "Saudi Arabia",
    "MEX": "Mexico",
    "MLS": "United States",
    "NED": "Netherlands",
    "NOR": "Norway",
    "POR": "Portugal",
    "QAT": "Qatar",
    "RUS": "Russia",
    "SCO": "Scotland",
    "SRB": "Serbia",
    "SUI": "Switzerland",
    "TUR": "Turkey",
    "UAE": "United Arab Emirates",
    "UKR": "Ukraine",
    "USA": "United States",
    "WAL": "Wales",
}
CLUB_TEAMMATE_MAP = {
    "Arsenal FC": "Bukayo Saka",
    "Aston Villa FC": "Ollie Watkins",
    "Atalanta Bergamo": "Ademola Lookman",
    "Atlético De Madrid": "Antoine Griezmann",
    "Bayer 04 Leverkusen": "Florian Wirtz",
    "Bayern Munich": "Jamal Musiala",
    "Borussia Dortmund": "Julian Brandt",
    "Brentford FC": "Bryan Mbeumo",
    "Brighton & Hove Albion FC": "Kaoru Mitoma",
    "Celtic FC": "Callum McGregor",
    "Chelsea FC": "Cole Palmer",
    "Crystal Palace FC": "Eberechi Eze",
    "Eintracht Frankfurt": "Mario Götze",
    "Everton FC": "Jordan Pickford",
    "FC Barcelona": "Pedri",
    "FC Bayern München": "Harry Kane",
    "FC Internazionale Milano": "Lautaro Martínez",
    "FC Midtjylland": "Franculino",
    "Fenerbahçe SK": "Fred",
    "Feyenoord Rotterdam": "Quinten Timber",
    "Galatasaray SK": "Mauro Icardi",
    "Inter Miami CF": "Lionel Messi",
    "Juventus FC": "Dušan Vlahović",
    "LAFC": "Olivier Giroud",
    "Le Havre AC": "Arouna Sangante",
    "Liverpool FC": "Mohamed Salah",
    "Manchester City FC": "Erling Haaland",
    "Manchester United FC": "Bruno Fernandes",
    "Newcastle United FC": "Alexander Isak",
    "Nottingham Forest FC": "Morgan Gibbs-White",
    "Olympique Marseille": "Adrien Rabiot",
    "Olympique Lyonnais": "Alexandre Lacazette",
    "Paris Saint-Germain": "Ousmane Dembélé",
    "PSV Eindhoven": "Noa Lang",
    "Rangers FC": "James Tavernier",
    "RB Leipzig": "Xavi Simons",
    "Real Madrid C. F.": "Jude Bellingham",
    "Real Madrid": "Jude Bellingham",
    "Real Betis": "Isco",
    "Roma": "Paulo Dybala",
    "Sunderland AFC": "Enzo Le Fée",
    "Tottenham Hotspur FC": "Son Heung-min",
    "VfL Wolfsburg": "Lovro Majer",
    "West Ham United FC": "Jarrod Bowen",
    "Wolverhampton Wanderers FC": "Matheus Cunha",
}
FAME_BY_CLUB = {
    "Arsenal FC": "Global",
    "Aston Villa FC": "Global",
    "Atlético De Madrid": "Global",
    "Bayer 04 Leverkusen": "Global",
    "Bayern Munich": "Global",
    "Borussia Dortmund": "Global",
    "Chelsea FC": "Global",
    "FC Barcelona": "Global",
    "FC Bayern München": "Global",
    "FC Internazionale Milano": "Global",
    "Inter Miami CF": "Global",
    "Juventus FC": "Global",
    "Liverpool FC": "Global",
    "Manchester City FC": "Elite",
    "Manchester United FC": "Global",
    "Paris Saint-Germain": "Global",
    "Real Madrid C. F.": "Elite",
    "Tottenham Hotspur FC": "Global",
}


def strip_accents(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    return "".join(char for char in normalized if unicodedata.category(char) != "Mn")


def normalize_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", strip_accents(value).lower()).strip()


def player_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", strip_accents(value).lower()).strip("-")


NATION_SLUGS = {nation: re.sub(r"[^a-z0-9]+", "-", strip_accents(nation).lower()).strip("-") for nation in TARGET_NATIONS}


def title_case_token(token: str) -> str:
    upper = token.upper()
    if upper in {"DE", "DA", "DI", "DEL", "DOS", "VAN", "VON", "AL", "EL", "LA", "LE", "LO"}:
        return token.capitalize()
    if upper.startswith("MC") and len(token) > 2:
        return f"Mc{token[2:].capitalize()}"
    return token[:1].upper() + token[1:].lower()


def title_case_name(name: str) -> str:
    tokens = []
    for token in name.split():
        pieces = re.split(r"([\-'])", token)
        tokens.append("".join(piece if piece in "-'" else title_case_token(piece) for piece in pieces))
    return " ".join(tokens)


def extract_players_array() -> list[dict]:
    text = PLAYERS_TS.read_text(encoding="utf-8")
    start = text.index("export const players")
    eq = text.index("=", start)
    open_index = text.index("[", eq)
    depth = 0
    end_index = -1
    for index in range(open_index, len(text)):
        char = text[index]
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                end_index = index
                break
    array_text = text[open_index : end_index + 1]
    script = f"console.log(JSON.stringify({array_text}))"
    output = run_node(script)
    return json.loads(output)


def run_node(script: str) -> str:
    import subprocess

    result = subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True)
    return result.stdout


@dataclass
class SquadRow:
    nation: str
    shirt_number: int
    position: str
    display_name: str
    accepted_answers: list[str]
    club: str
    club_country: str
    dob: str


def parse_pdf_rows() -> list[SquadRow]:
    from pypdf import PdfReader

    team_re = re.compile(r"^(.+?) \(([A-Z]{3})\)$")
    row_re = re.compile(r"^(GK|DF|MF|FW)\s*(.+?)(\d{2}/\d{2}/\d{4})(.*)$")
    lower_start_re = re.compile(r"[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]")
    korean_surnames = {"BAE", "CHO", "EOM", "HWANG", "JO", "KIM", "LEE", "OH", "PAIK", "PARK", "SEOL", "SON", "SONG", "YANG"}
    nation = None
    rows: list[SquadRow] = []
    shirt_number = 0
    reader = PdfReader(str(SQUAD_PDF))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    def clean(value: str) -> str:
        return re.sub(r"\s+", " ", value.replace("\x00", "")).strip()

    def extract_given_name(rest: str) -> str:
        token = clean(rest).split(" ")[0]
        match = re.match(r"^([A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]+)", token)
        return match.group(1) if match else ""

    def parse_display_name(blob: str, current_nation: str) -> tuple[str, list[str]]:
        blob = clean(blob)
        match = lower_start_re.search(blob)
        if not match:
            official, rest = blob, ""
        elif match.start() == 0:
            parts = blob.split(maxsplit=1)
            official = parts[0]
            rest = parts[1] if len(parts) > 1 else ""
        else:
            official = blob[: match.start()].strip()
            rest = blob[match.start() :]

        given = extract_given_name(rest)
        official_title = title_case_name(official)
        given_title = title_case_name(given) if given else ""
        official_first = normalize_name(official_title).split()[0] if normalize_name(official_title) else ""
        given_norm = normalize_name(given_title)

        if current_nation == "South Korea" and " " not in official and given:
            display = title_case_name(f"{official} {given}") if official.upper() in korean_surnames else title_case_name(f"{given} {official}")
        elif current_nation == "Brazil":
            display = official_title
        elif given and official_first != given_norm:
            display = f"{given_title} {official_title}".strip()
        else:
            display = official_title

        aliases = []
        for alias in [official_title, f"{official_title} {given_title}".strip()]:
            if alias and normalize_name(alias) != normalize_name(display):
                aliases.append(alias)
        parts = display.split()
        if len(parts) > 1:
            family = " ".join(parts[1:])
            aliases.append(family)
        ascii_display = strip_accents(display)
        if ascii_display != display:
            aliases.append(ascii_display)
        deduped = []
        seen = set()
        for alias in aliases:
            key = normalize_name(alias)
            if key and key not in seen:
                seen.add(key)
                deduped.append(alias)
        return display, deduped

    for raw_line in text.splitlines():
        line = clean(raw_line)
        team_match = team_re.match(line)
        if team_match and not line.startswith("FIFA"):
            raw_nation = team_match.group(1)
            nation = "United States" if raw_nation == "USA" else "South Korea" if raw_nation == "Korea Republic" else raw_nation
            shirt_number = 0
            continue

        row_match = row_re.match(line)
        if not row_match or nation not in TARGET_NATIONS:
            continue

        shirt_number += 1
        code = row_match.group(1)
        display_name, aliases = parse_display_name(row_match.group(2), nation)
        rest = row_match.group(4)
        club_match = re.search(r"([^\(]+)\(([A-Z]{3})\)\s*\d+$", rest.strip())
        club = clean(club_match.group(1)) if club_match else "[Verify]"
        club_country = CLUB_COUNTRY_MAP.get(club_match.group(2), "[Verify]") if club_match else "[Verify]"
        rows.append(
            SquadRow(
                nation=nation,
                shirt_number=shirt_number,
                position=POSITION_MAP[code],
                display_name=display_name,
                accepted_answers=aliases,
                club=club,
                club_country=club_country,
                dob=row_match.group(3),
            )
        )
    return rows


def wikipedia_api(params: dict) -> dict:
    base = "https://en.wikipedia.org/w/api.php"
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(f"{base}?{query}", headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def wikipedia_search_title(name: str, nation: str) -> str | None:
    search = wikipedia_api(
        {
            "action": "query",
            "list": "search",
            "srsearch": f'{name} "{nation}" footballer',
            "format": "json",
            "srlimit": 5,
        }
    )
    results = search.get("query", {}).get("search", [])
    target = normalize_name(name)
    for result in results:
        title = result["title"]
        normalized_title = normalize_name(title)
        if normalized_title == target:
            return title
    for result in results:
        title = result["title"]
        normalized_title = normalize_name(title)
        if target and (target in normalized_title or normalized_title in target):
            return title
    return None


def wikipedia_page_data(title: str) -> tuple[str, str]:
    data = wikipedia_api(
        {
            "action": "query",
            "prop": "extracts|revisions",
            "titles": title,
            "exintro": "1",
            "explaintext": "1",
            "rvslots": "main",
            "rvprop": "content",
            "formatversion": "2",
            "format": "json",
        }
    )
    page = data["query"]["pages"][0]
    extract = page.get("extract", "")
    wikitext = page.get("revisions", [{}])[0].get("slots", {}).get("main", {}).get("content", "")
    return extract, wikitext


def extract_infobox_value(wikitext: str, key: str) -> str | None:
    match = re.search(rf"^\|\s*{re.escape(key)}\s*=\s*(.+)$", wikitext, flags=re.MULTILINE)
    if not match:
        return None
    return clean_wiki(match.group(1))


def clean_wiki(value: str) -> str:
    value = re.sub(r"<!--.*?-->", "", value)
    value = re.sub(r"<ref[^>]*>.*?</ref>", "", value)
    value = re.sub(r"<[^>]+>", "", value)
    value = value.replace("{{nowrap|", "").replace("}}", "")
    value = value.replace("{{small|", "").replace("{{flagicon|", "")
    value = value.replace("{{loan|", "").replace("{{Loan|", "")
    value = value.replace("{{birth date and age|", "").replace("{{birth date|", "")
    value = value.replace("{{", "").replace("}}", "")
    value = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]", r"\1", value)
    value = re.sub(r"\|.*", "", value)
    value = value.replace("→", "").replace("&nbsp;", " ")
    value = value.replace("()", "")
    return re.sub(r"\s+", " ", value).strip(" ,")


def extract_club_path(wikitext: str) -> str:
    clubs = []
    index = 1
    while True:
        raw_value = extract_infobox_value(wikitext, f"clubs{index}")
        if raw_value is None:
            break
        lower = raw_value.lower()
        loan = "loan" in lower or raw_value.startswith("→")
        cleaned = clean_wiki(raw_value)
        cleaned = cleaned.replace("loan", "").replace("Loan", "").replace("()", "").strip(" -")
        if cleaned:
            clubs.append(f"{cleaned} (loan)" if loan else cleaned)
        index += 1
    deduped = []
    for club in clubs:
        if not deduped or deduped[-1] != club:
            deduped.append(club)
    return " -> ".join(deduped) if deduped else "[Verify]"


def extract_summary_fact(extract: str, display_name: str) -> str:
    sentences = [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", extract) if sentence.strip()]
    for sentence in sentences[1:3]:
        if len(sentence) <= 170:
            return sentence
    for sentence in sentences[:1]:
        if len(sentence) <= 170 and "plays as" not in sentence.lower():
            return sentence
    return "[Verify]"


def extract_world_cup_appearances(wikitext: str) -> str:
    years = [2014, 2018, 2022]
    count = sum(1 for year in years if f"{year} FIFA World Cup players" in wikitext)
    if count == 0:
        return "First World Cup"
    if count == 1:
        return "Played in 1 previous World Cup"
    return f"Played in {count} previous World Cups"


def extract_national_stats(wikitext: str, nation: str) -> tuple[str, str, str]:
    entries = []
    index = 1
    while True:
        team = extract_infobox_value(wikitext, f"nationalteam{index}")
        if team is None:
            break
        years = extract_infobox_value(wikitext, f"nationalyears{index}") or ""
        caps = extract_infobox_value(wikitext, f"nationalcaps{index}") or ""
        goals = extract_infobox_value(wikitext, f"nationalgoals{index}") or ""
        entries.append((team, years, caps, goals))
        index += 1

    for team, years, caps, goals in reversed(entries):
        normalized_team = normalize_name(team)
        if normalize_name(nation) in normalized_team or nation == "United States" and "usa" in normalized_team:
            debut = years.split("–")[0].split("-")[0].strip() if years else "[Verify]"
            return debut or "[Verify]", caps or "[Verify]", goals or "[Verify]"
    return "[Verify]", "[Verify]", "[Verify]"


def compute_age(dob: str) -> int:
    day, month, year = map(int, dob.split("/"))
    birth = dt.date(year, month, day)
    snapshot = dt.date.fromisoformat(SNAPSHOT_DATE)
    return snapshot.year - birth.year - ((snapshot.month, snapshot.day) < (birth.month, birth.day))


def build_aliases(display_name: str, full_name: str, fifa_aliases: list[str]) -> tuple[list[str], list[str]]:
    values = [display_name, full_name, strip_accents(display_name), strip_accents(full_name), *fifa_aliases]
    parts = display_name.split()
    if len(parts) > 1:
        values.append(parts[-1])
        values.append(strip_accents(parts[-1]))
    search_aliases = []
    accepted_answers = []
    seen = set()
    for value in values:
        value = value.strip()
        key = normalize_name(value)
        if value and key and key not in seen:
            seen.add(key)
            search_aliases.append(value)
            accepted_answers.append(value)
    return search_aliases, accepted_answers


def infer_played_alongside(club: str) -> str:
    return CLUB_TEAMMATE_MAP.get(club, "[Verify]")


def infer_fame_tier(club: str, caps: str) -> str:
    if club in FAME_BY_CLUB:
        return FAME_BY_CLUB[club]
    if caps.isdigit() and int(caps) >= 40:
        return "Global"
    if caps.isdigit() and int(caps) >= 10:
        return "Continental"
    return "National"


def infer_difficulty_tier(fame_tier: str) -> str:
    return "medium" if fame_tier in {"Elite", "Global", "Continental"} else "hard"


def is_value_verified(value) -> bool:
    if value is None:
        return False
    if isinstance(value, list):
        return len(value) > 0
    if isinstance(value, int):
        return True
    text = str(value).strip()
    return bool(text) and "[Verify]" not in text


REQUIRED_PLAYABLE_FIELDS = [
    "fullName",
    "displayName",
    "acceptedAnswers",
    "shirtNumber",
    "position",
    "club",
    "clubCountry",
    "age",
    "internationalDebut",
    "caps",
    "internationalGoals",
    "worldCupAppearances",
    "careerPath",
    "clueFact",
    "playedAlongside",
    "sources",
    "snapshotDate",
    "fameTier",
]


def evaluate_playability(player: dict) -> tuple[bool, list[str]]:
    reasons = []
    if player.get("exclude") is True:
        reasons.append("excluded by X")
    for field in REQUIRED_PLAYABLE_FIELDS:
        value = player.get(field)
        if value is None or value == "" or value == []:
            reasons.append(f"missing required field: {field}")
        elif isinstance(value, str) and "[Verify]" in value:
            reasons.append(f"contains [Verify]: {field}")
    return (len(reasons) == 0, reasons)


def build_player(existing_names: set[str], squad_row: SquadRow) -> dict:
    title = wikipedia_search_title(squad_row.display_name, squad_row.nation)
    time.sleep(0.05)
    extract, wikitext = wikipedia_page_data(title) if title else ("", "")

    full_name = extract_infobox_value(wikitext, "fullname") or extract_infobox_value(wikitext, "name") or squad_row.display_name
    full_name = re.sub(r"\s*\([^)]*\)", "", full_name).strip()
    debut, caps, goals = extract_national_stats(wikitext, squad_row.nation)
    career_path = extract_club_path(wikitext)
    fact = extract_summary_fact(extract, squad_row.display_name)
    world_cups = extract_world_cup_appearances(wikitext)
    search_aliases, accepted_answers = build_aliases(squad_row.display_name, full_name, squad_row.accepted_answers)
    fame_tier = infer_fame_tier(squad_row.club, caps)

    player = {
        "id": player_slug(f"{squad_row.nation}-{squad_row.display_name}"),
        "fullName": full_name,
        "displayName": squad_row.display_name,
        "searchAliases": search_aliases,
        "acceptedAnswers": accepted_answers,
        "nationality": squad_row.nation,
        "nation": squad_row.nation,
        "nationSlug": NATION_SLUGS[squad_row.nation],
        "shirtNumber": squad_row.shirt_number,
        "position": squad_row.position,
        "club": squad_row.club,
        "clubCountry": squad_row.club_country,
        "age": compute_age(squad_row.dob),
        "internationalDebut": debut,
        "caps": int(caps) if caps.isdigit() else "[Verify]",
        "internationalGoals": int(goals) if goals.isdigit() else "[Verify]",
        "nationalTeamDebutYear": int(debut[:4]) if re.match(r"^\d{4}", debut) else 0,
        "worldCupAppearances": world_cups,
        "careerPath": career_path,
        "kitPrimaryColor": "#1f7a45",
        "kitSecondaryColor": "#ffffff",
        "kitAccentColor": "#f5c542",
        "clueFact": fact,
        "playedAlongside": infer_played_alongside(squad_row.club),
        "sources": f"FIFA-PDF; https://en.wikipedia.org/wiki/{title.replace(' ', '_')}" if title else "FIFA-PDF; [Verify]",
        "snapshotDate": SNAPSHOT_DATE,
        "difficultyTier": infer_difficulty_tier(fame_tier),
        "fameTier": fame_tier,
    }

    if player["id"] in existing_names:
        player["id"] = f"{player['id']}-wc"
    return player


def format_ts_value(value, indent=4) -> str:
    space = " " * indent
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        inner = ",\n".join(f"{space}  {format_ts_value(item, indent + 2)}" for item in value)
        return f"[\n{inner}\n{space}]"
    if isinstance(value, dict):
        lines = ["{"]
        for key, item in value.items():
            lines.append(f'{space}  "{key}": {format_ts_value(item, indent + 2)},')
        lines.append(f"{space}}}")
        return "\n".join(lines)
    return json.dumps(value)


def write_additions_ts(players: list[dict]) -> None:
    lines = ['import type { Player } from "./types";', "", "export const majorNationAdditions: Player[] = ["]
    for player in players:
        lines.append(format_ts_value(player, 2) + ",")
    lines.append("];")
    ADDITIONS_TS.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_reviews(added_players: list[dict], summary_rows: list[dict], blocked_rows: list[dict]) -> None:
    ADDITIONS_REVIEW.parent.mkdir(parents=True, exist_ok=True)
    with ADDITIONS_REVIEW.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "Nation",
                "Player Name",
                "Shirt Number",
                "Position",
                "Club",
                "Club Country",
                "International Debut",
                "Caps",
                "Goals",
                "World Cup Appearances",
                "Career Path",
                "Fact",
                "Played Alongside",
                "Sources",
                "Snapshot Date",
                "Fame Tier",
                "Playable",
            ],
        )
        writer.writeheader()
        for player in added_players:
            playable, _ = evaluate_playability(player)
            writer.writerow(
                {
                    "Nation": player["nation"],
                    "Player Name": player["displayName"],
                    "Shirt Number": player["shirtNumber"],
                    "Position": player["position"],
                    "Club": player["club"],
                    "Club Country": player["clubCountry"],
                    "International Debut": player["internationalDebut"],
                    "Caps": player["caps"],
                    "Goals": player["internationalGoals"],
                    "World Cup Appearances": player["worldCupAppearances"],
                    "Career Path": player["careerPath"],
                    "Fact": player["clueFact"],
                    "Played Alongside": player["playedAlongside"],
                    "Sources": player["sources"],
                    "Snapshot Date": player["snapshotDate"],
                    "Fame Tier": player["fameTier"],
                    "Playable": "yes" if playable else "no",
                }
            )

    with NOT_PLAYABLE_REVIEW.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["Nation", "Player Name", "Reason"])
        writer.writeheader()
        for row in blocked_rows:
            writer.writerow(row)

    summary_path = ROOT / "data" / "major-nation-summary.json"
    summary_path.write_text(json.dumps(summary_rows, indent=2), encoding="utf-8")


def main() -> None:
    existing_players = extract_players_array()
    existing_names = set()
    existing_by_nation = {nation: [] for nation in TARGET_NATIONS}
    for player in existing_players:
        if player.get("nation") in existing_by_nation:
            existing_by_nation[player["nation"]].append(player)
        for value in [player.get("displayName", ""), player.get("fullName", ""), *(player.get("acceptedAnswers") or [])]:
            key = normalize_name(value)
            if key:
                existing_names.add(key)

    squad_rows = [row for row in parse_pdf_rows() if row.nation in TARGET_NATIONS]
    additions = []
    summary_rows = []
    blocked_rows = []
    existing_ids = {player["id"] for player in existing_players}

    for nation in TARGET_NATIONS:
        nation_rows = [row for row in squad_rows if row.nation == nation]
        missing_rows = []
        already_exists = 0
        for row in nation_rows:
            possible_keys = {normalize_name(row.display_name), *(normalize_name(alias) for alias in row.accepted_answers)}
            if any(key in existing_names for key in possible_keys if key):
                already_exists += 1
            else:
                missing_rows.append(row)

        nation_additions = [build_player(existing_ids, row) for row in missing_rows]
        additions.extend(nation_additions)

        immediately_playable = 0
        verify_blocked = 0
        blank_blocked = 0
        excluded = 0
        for row in nation_additions:
            playable, reasons = evaluate_playability(row)
            if playable:
                immediately_playable += 1
            else:
                if any("contains [Verify]" in reason for reason in reasons):
                    verify_blocked += 1
                if any("missing required field" in reason for reason in reasons):
                    blank_blocked += 1
                if any("excluded" in reason for reason in reasons):
                    excluded += 1
                blocked_rows.append(
                    {
                        "Nation": row["nation"],
                        "Player Name": row["displayName"],
                        "Reason": "; ".join(reasons),
                    }
                )

        summary_rows.append(
            {
                "nation": nation,
                "total_squad_players_found": len(nation_rows),
                "already_existed": already_exists,
                "newly_added": len(nation_additions),
                "immediately_playable": immediately_playable,
                "blocked_by_verify": verify_blocked,
                "blocked_by_blank_fields": blank_blocked,
                "excluded_by_x": excluded,
            }
        )

    write_additions_ts(additions)
    write_reviews(additions, summary_rows, blocked_rows)
    print(json.dumps(summary_rows, indent=2))
    print(f"added {len(additions)} players")


if __name__ == "__main__":
    main()
