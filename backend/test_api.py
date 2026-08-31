import requests
import json
import time

time.sleep(2)  # Wait for server to be fully ready

BASE = "http://127.0.0.1:8000"

print("--- 1. Testing Health Endpoint ---")
r = requests.get(f"{BASE}/api/health")
print("Health status:", r.status_code, r.json())
assert r.status_code == 200

print("\n--- 2. Testing Auth Login ---")
r = requests.post(f"{BASE}/api/auth/login", json={"email": "student@noteflow.ai", "password": "noteflow123"})
print("Login status:", r.status_code)
assert r.status_code == 200
token_data = r.json()
token = token_data["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("\n--- 3. Testing Dashboard Metrics ---")
r = requests.get(f"{BASE}/api/dashboard", headers=headers)
print("Dashboard status:", r.status_code, "Total lectures:", r.json().get("total_lectures"))
assert r.status_code == 200

print("\n--- 4. Testing Lectures List ---")
r = requests.get(f"{BASE}/api/lectures", headers=headers)
lectures = r.json()
print("Lectures count:", len(lectures))
assert len(lectures) >= 3

print("\n--- 5. Testing Lecture Detail ---")
first_id = lectures[0]["id"]
r = requests.get(f"{BASE}/api/lectures/{first_id}", headers=headers)
lec_detail = r.json()
print("Lecture title:", lec_detail["title"])
print("Has summary:", bool(lec_detail.get("summary")))
print("Has transcript:", bool(lec_detail.get("transcript")))
print("Has key points:", len(lec_detail.get("key_points", [])))
print("Has revision notes:", len(lec_detail.get("revision_notes", [])))
print("Has quizzes:", len(lec_detail.get("quizzes", [])))
assert r.status_code == 200

print("\n--- 6. Testing Global Search ---")
r = requests.get(f"{BASE}/api/search?q=quantum", headers=headers)
search_res = r.json()
print("Search results for 'quantum':", search_res["total_results"], "items found")
assert r.status_code == 200

print("\n--- 7. Testing Quizzes & Submission ---")
quizzes_r = requests.get(f"{BASE}/api/quizzes", headers=headers)
quizzes_list = quizzes_r.json()
print("Quizzes count:", len(quizzes_list))
if len(quizzes_list) > 0:
    first_quiz = quizzes_list[0]
    quiz_detail_r = requests.get(f"{BASE}/api/quizzes/{first_quiz['id']}", headers=headers)
    q_data = quiz_detail_r.json()
    questions = q_data.get("questions", [])
    print(f"Quiz '{q_data['title']}' has {len(questions)} questions")
    
    # Submit mock answers
    answers = {}
    for q in questions:
        answers[q["id"]] = q["correct_answer"]
    
    sub_r = requests.post(f"{BASE}/api/quizzes/{first_quiz['id']}/submit", json={"answers": answers}, headers=headers)
    print("Submit outcome status:", sub_r.status_code, "Score:", sub_r.json().get("score"), "Percentage:", sub_r.json().get("percentage"))
    assert sub_r.status_code == 200

print("\n--- 8. Testing Student Notes ---")
notes_r = requests.get(f"{BASE}/api/notes", headers=headers)
notes = notes_r.json()
print("User notes count:", len(notes))
assert r.status_code == 200

print("\n============================================")
print("ALL BACKEND API VERIFICATION TESTS PASSED SUCCESSFULLY!")
print("============================================")
