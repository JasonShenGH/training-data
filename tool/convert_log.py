import re
import json
from datetime import datetime

input_file = "PERSONAL_DATA.LOG"
output_file = "PERSONAL_DATA.json"

data = {
    "workouts": [],
    "atl": [],
    "ctl": [],
    "comments": [],
    "sleep_sessions": []
}

section = "workouts"

def parse_hr_distribution(text):
    zones = {}
    matches = re.findall(r'Zone (\d): ([\d\.]+)%', text)
    for z, v in matches:
        zones[f"zone{z}"] = float(v)
    return zones

def parse_power_distribution(text):
    zones = {}
    matches = re.findall(r'Z(\d): ([\d\.]+)%', text)
    for z, v in matches:
        zones[f"z{z}"] = float(v)
    return zones

def parse_workout(line):
    obj = {}

    def get(pattern):
        m = re.search(pattern, line)
        return m.group(1) if m else None

    obj["type"] = get(r'Type: ([^,]+)')
    obj["date"] = get(r'Date: ([^,]+)')
    obj["duration_min"] = int(get(r'Duration: (\d+) mins') or 0)
    obj["avg_hr"] = int(get(r'Average HR: (\d+)') or 0)
    obj["max_hr"] = int(get(r'Max HR: (\d+)') or 0)
    obj["rpe"] = float(get(r'RPE: ([\d\.]+)') or 0)

    hr_dist = get(r'HR Distribution: \[(.*?)\]')
    if hr_dist:
        obj["hr_distribution"] = parse_hr_distribution(hr_dist)

    # optional fields
    avg_power = get(r'Avg Power: (\d+)W')
    if avg_power:
        obj["avg_power"] = int(avg_power)

    max_power = get(r'Max Power: (\d+)W')
    if max_power:
        obj["max_power"] = int(max_power)

    power_dist = get(r'Power Distribution: \[(.*?)\]')
    if power_dist:
        obj["power_distribution"] = parse_power_distribution(power_dist)

    cadence_incl = get(r'Avg Cadence \(incl\. 0\): (\d+)')
    if cadence_incl:
        obj["avg_cadence_incl_0"] = int(cadence_incl)

    cadence_excl = get(r'Avg Cadence \(excl\. 0\): (\d+)')
    if cadence_excl:
        obj["avg_cadence_excl_0"] = int(cadence_excl)

    max_cadence = get(r'Max Cadence: (\d+)')
    if max_cadence:
        obj["max_cadence"] = int(max_cadence)

    distance = get(r'Move distance: ([\d\.]+)KM')
    if distance:
        obj["distance_km"] = float(distance)

    return obj


def parse_sleep_block(block):
    lines = block.strip().split("\n")
    if len(lines) < 7:
        return None

    start_end = lines[0].split(" - ")
    return {
        "start": start_end[0],
        "end": start_end[1],
        "total": lines[1].split(": ")[1],
        "core": lines[2].split(": ")[1],
        "deep": lines[3].split(": ")[1],
        "rem": lines[4].split(": ")[1],
        "wake": lines[5].split(": ")[1],
        "recovery": lines[6].split(": ")[1]
    }


with open(input_file, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()

sleep_buffer = []

for line in lines:
    line = line.strip()
    if not line:
        continue

    if line.startswith("ATL("):
        section = "atl"
        continue
    elif line.startswith("CTL("):
        section = "ctl"
        continue
    elif line.startswith("Comments"):
        section = "comments"
        continue
    elif line.startswith("Sleep Session Detail"):
        section = "sleep"
        continue

    # WORKOUTS
    if section == "workouts" and line.startswith("Type:"):
        data["workouts"].append(parse_workout(line))

    # ATL
    elif section == "atl" and line.startswith("Date:"):
        m = re.search(r'Date: ([\d\-]+), ATL: ([\d\.]+)', line)
        if m:
            data["atl"].append({
                "date": m.group(1),
                "atl": float(m.group(2))
            })

    # CTL
    elif section == "ctl" and line.startswith("Date:"):
        m = re.search(r'Date: ([\d\-]+), CTL: ([\d\.]+)', line)
        if m:
            data["ctl"].append({
                "date": m.group(1),
                "ctl": float(m.group(2))
            })

    # COMMENTS
    elif section == "comments" and line.startswith("From"):
        m = re.search(r'From ([\d\-]+) to ([\d\-]+): (.+)', line)
        if m:
            data["comments"].append({
                "from": m.group(1),
                "to": m.group(2),
                "text": m.group(3)
            })

    # SLEEP
    elif section == "sleep":
        if re.match(r'\d{4}年', line):
            if sleep_buffer:
                session = parse_sleep_block("\n".join(sleep_buffer))
                if session:
                    data["sleep_sessions"].append(session)
                sleep_buffer = []
        sleep_buffer.append(line)

# last sleep block
if sleep_buffer:
    session = parse_sleep_block("\n".join(sleep_buffer))
    if session:
        data["sleep_sessions"].append(session)

# write JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Conversion complete: {output_file}")