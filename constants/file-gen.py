import json

# Read a file containg the original constant in plain text
with open("input.txt", "r", encoding="utf-8") as file:
    nums = file.read()
    result = []
    result.append({"start": nums[0]})
    i = 0
    for num in nums[2:]:
        result.append({i: num})
        i += 1
    json.dump(result, open("output.json", "w"), indent=4)