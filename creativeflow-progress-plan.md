# CreativeFlow AI — Progress Plan

## Top-Level Overview

**Goal:** Bring CreativeFlow AI from its current skeleton state (~30% complete) to a fully working MVP with IBM Granite AI integration, a 4-endpoint REST API, and a composed React UI.

**Scope:**
- Implement all empty backend files: config, prompts, services, controllers, routes, and wire them into `server.js`
- Implement all empty frontend files: `api.js` service, all 5 React components, and `Home.jsx` page
- Refactor `App.jsx` to use the component system
- Fix existing bugs (endpoint mismatch, filename typo)

**Out of Scope (per MVP.md):** Authentication, database, project history, team collaboration, payments.

**Approach:** Build backend-first (bottom-up: config → prompts → services → controllers → routes → server), then frontend (api.js → components → Home.jsx → App.jsx refactor). Each sub-task is independently testable.

**Mock Fallback Strategy:** Every service checks a `USE_MOCK` environment variable. When `USE_MOCK=true`, the service returns a hardcoded realistic response instead of calling IBM Granite. This allows the full UI to be developed and demonstrated without live credentials. Switching to real AI requires only changing one `.env` value.

---

## Sub-Tasks

---

### Sub-Task 1 — Backend: IBM watsonx Config + Environment Setup

**Intent:** Establish the AI client foundation and mock fallback flag. All 4 services depend on this. Without it, no AI call can be made.

**Expected Outcomes:**
- `backend/config/watsonx.js` exports a configured IBM watsonx client instance
- `backend/.env.example` updated to include `USE_MOCK=true` flag
- `@ibm-cloud/watsonx-ai` SDK added to `backend/package.json`
- `USE_MOCK=true` is the default so the app works immediately without credentials

**Todo List:**
1. Install the IBM watsonx AI Node.js SDK: `@ibm-cloud/watsonx-ai`
2. Implement `backend/config/watsonx.js` — reads `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`, `MODEL_ID` from `process.env` and exports the configured client; also exports `USE_MOCK` boolean
3. Add `require('dotenv').config()` bootstrap at the top of `server.js`
4. Update `backend/.env.example` to add `USE_MOCK=true` with a comment explaining how to switch to real AI

**Relevant Context:**
- `backend/.env.example` — lists the 4 required env vars; needs `USE_MOCK` added
- `backend/config/watsonx.js` — currently empty
- `backend/server.js` — needs `dotenv` bootstrapped
- `backend/package.json` — dependencies list to update

**Status:** [ ] pending

---

### Sub-Task 2 — Backend: Prompt Templates (All 4)

**Intent:** Define the AI prompt contracts before writing any service logic. Each prompt file exports a builder function that produces the exact text sent to IBM Granite.

**Expected Outcomes:**
- `creativeBriefPrompt.js` — takes `{ topic, audience, platform, goal }`, returns system + user prompt strings
- `scriptPrompt.js` — takes `{ creativeBrief }`, returns prompt for hook/script/callToAction
- `storyboardPrompt.js` — takes `{ script, creativeBrief }`, returns prompt for 3 scenes
- `mentorPrompt.js` — takes `{ creativeBrief, script, storyboard }`, returns prompt for scored review

**Todo List:**
1. Implement `backend/prompts/creativeBriefPrompt.js` — system role as content strategist, user prompt builds brief from inputs
2. Implement `backend/prompts/scriptPrompt.js` — system role as professional scriptwriter, user prompt uses the creative brief
3. Implement `backend/prompts/storyboardPrompt.js` — system role as visual director, user prompt builds 3-scene storyboard from script
4. Implement `backend/prompts/mentorPrompt.js` — system role as experienced creative director/mentor, user prompt scores and suggests improvements
5. All prompts must instruct the model to respond **only in JSON** matching the API contracts defined in `spec.md` Phase 5

**Relevant Context:**
- `spec.md` lines 5201–5298 — API contracts (exact JSON shapes for each endpoint response)
- All 4 prompt files currently empty

**Status:** [ ] pending

---

### Sub-Task 3 — Backend: Services (All 4) with Mock Fallback

**Intent:** Implement the business logic layer that calls IBM Granite with the prompt templates and returns structured data. Each service checks `USE_MOCK` first — if true it returns a hardcoded realistic response, otherwise it calls IBM Granite. Each service has a single responsibility.

**Expected Outcomes:**
- `creativeBriefService.js` — async function `generateCreativeBrief(topic, audience, platform, goal)` → `{ title, coreMessage, hookIdea, tone, keyTakeaway }`
- `scriptService.js` — async function `generateScript(creativeBrief)` → `{ hook, script, callToAction }`
- `storyboardService.js` — async function `generateStoryboard(script, creativeBrief)` → `{ scenes: [{ scene, visual, narration }] }`
- `mentorService.js` — async function `reviewCreativePackage(creativeBrief, script, storyboard)` → `{ overallScore, strengths, improvements, nextSteps }`
- When `USE_MOCK=true`, all 4 services return realistic hardcoded data instantly (no API call)
- When `USE_MOCK=false`, all 4 services call IBM Granite and parse the JSON response

**Todo List:**
1. Implement `creativeBriefService.js`:
   - If `USE_MOCK=true`, return a realistic hardcoded creative brief object
   - Else: call IBM Granite using watsonx config + creativeBriefPrompt, parse JSON response, return structured object
2. Implement `scriptService.js` — same mock/real pattern with scriptPrompt
3. Implement `storyboardService.js` — same mock/real pattern with storyboardPrompt
4. Implement `mentorService.js` — same mock/real pattern with mentorPrompt; receives the full creative package (brief + script + storyboard)
5. Add JSON parse error handling in each service — if the model response is not valid JSON, throw a descriptive error
6. Mock responses must match the exact shape defined in the API contracts (so switching to real AI requires zero frontend changes)

**Relevant Context:**
- `backend/config/watsonx.js` — exports the AI client AND the `USE_MOCK` boolean (completed in Sub-Task 1)
- `backend/prompts/*.js` — the prompt builders (completed in Sub-Task 2)
- `spec.md` lines 5201–5298 — exact response shapes each service must produce

**Status:** [ ] pending

---

### Sub-Task 4 — Backend: Controllers + Routes + server.js Wiring

**Intent:** Expose the services over HTTP. Connect the full call chain: `server.js` → route → controller → service → response.

**Expected Outcomes:**
- All 4 controllers handle `req`, call their service, and return `res.json()` or `res.status(500)`
- All 4 route files register a `POST /` handler pointing to their controller
- `server.js` mounts each router at the correct path:
  - `POST /creative-brief`
  - `POST /generate-script`
  - `POST /generate-storyboard`
  - `POST /mentor-review`
- The legacy hardcoded `app.post('/generate-script', ...)` mock is removed from `server.js`

**Todo List:**
1. Implement `controllers/creativeBriefController.js` — extract `{ topic, audience, platform, goal }` from `req.body`, call service, return JSON
2. Implement `controllers/scriptController.js` — extract `{ creativeBrief }` from `req.body`, call service, return JSON
3. Implement `controllers/storyboardController.js` — extract `{ script, creativeBrief }` from `req.body`, call service, return JSON
4. Implement `controllers/mentorController.js` — extract `{ creativeBrief, script, storyboard }` from `req.body`, call service, return JSON
5. Implement all 4 route files (`creativeBrief.js`, `script.js`, `storyboard.js`, `mentor.js`) — each exports an Express router with a single `router.post('/', controller)`
6. Update `server.js` — remove mock endpoint, add `require` + `app.use()` for all 4 routes at their correct paths

**Relevant Context:**
- `backend/server.js` — currently has the mock endpoint that must be replaced
- `spec.md` lines 4926–4934 — canonical endpoint list
- All controller and route files currently empty

**Status:** [ ] pending

---

### Sub-Task 5 — Frontend: API Service Layer (`api.js`)

**Intent:** Create a single, clean abstraction for all backend calls. Components must never call `fetch` directly — they use `api.js`. This prevents URL duplication and makes error handling consistent.

**Expected Outcomes:**
- `frontend/services/api.js` exports 4 async functions: `generateCreativeBrief`, `generateScript`, `generateStoryboard`, `reviewWithMentor`
- Each function calls the correct backend endpoint with the correct payload
- Each function throws a descriptive error on non-OK HTTP responses

**Todo List:**
1. Implement `frontend/services/api.js` with a `BASE_URL` constant (`http://localhost:3001`)
2. Add `generateCreativeBrief({ topic, audience, platform, goal })` → calls `POST /creative-brief`
3. Add `generateScript({ creativeBrief })` → calls `POST /generate-script`
4. Add `generateStoryboard({ script, creativeBrief })` → calls `POST /generate-storyboard`
5. Add `reviewWithMentor({ creativeBrief, script, storyboard })` → calls `POST /mentor-review`
6. Each function checks `response.ok` and throws if not, including the error message from the response body

**Relevant Context:**
- `frontend/services/api.js` — currently empty
- `spec.md` lines 5201–5298 — request/response shapes for each endpoint
- Components built in Sub-Task 6 will import from this file

**Status:** [ ] pending

---

### Sub-Task 6 — Frontend: React Components (All 5)

**Intent:** Build the 5 presentational components that display AI-generated output and capture user input. These are pure display/input components — no API calls, no state management beyond their own.

**Expected Outcomes:**
- `InputForm.jsx` — form accepting topic, audience, platform, goal; calls `onSubmit` prop
- `CreativeBriefCard.jsx` — displays `{ title, coreMessage, hookIdea, tone, keyTakeaway }`
- `ScriptCard.jsx` — displays `{ hook, script, callToAction }`
- `StoryboardCard.jsx` — displays `{ scenes: [{ scene, visual, narration }] }`
- `MentorCard.jsx` — displays `{ overallScore, strengths, improvements, nextSteps }`
- Filename typo fixed: `reativeBriefCard.jsx` renamed to `CreativeBriefCard.jsx`

**Todo List:**
1. Rename `frontend/components/reativeBriefCard.jsx` → `CreativeBriefCard.jsx`
2. Implement `InputForm.jsx` — controlled form with 4 fields (topic text input, audience select, platform select, goal text input) and a Generate button; accepts `onSubmit(formData)` and `isLoading` props
3. Implement `CreativeBriefCard.jsx` — renders all brief fields from spec; accepts `brief` prop
4. Implement `ScriptCard.jsx` — renders hook, script body, and call to action; accepts `script` prop
5. Implement `StoryboardCard.jsx` — renders each scene in a numbered list with visual and narration; accepts `storyboard` prop
6. Implement `MentorCard.jsx` — renders overall score, strengths list, improvements list, next steps list; accepts `feedback` prop
7. Use the CSS variables from `frontend/src/index.css` for styling (no new inline styles)

**Relevant Context:**
- `spec.md` lines 5100–5198 — component field specifications
- `frontend/src/index.css` — design system with CSS variables and utility classes
- `frontend/src/App.css` — existing card/layout styles to reuse

**Status:** [ ] pending

---

### Sub-Task 7 — Frontend: Home.jsx Page + App.jsx Refactor

**Intent:** Compose the completed components and API service into a working end-to-end user journey. Replace the monolithic inline `App.jsx` with a clean component tree.

**Expected Outcomes:**
- `frontend/pages/Home.jsx` orchestrates the full workflow: input → creative brief → script → storyboard → mentor review
- State is held in `Home.jsx`: `formData`, `brief`, `script`, `storyboard`, `feedback`, `isLoading`, `error`
- The workflow is sequential: each stage's output becomes the next stage's input
- `App.jsx` is simplified to just render `<Home />`
- Loading and error states are visible to the user

**Todo List:**
1. Implement `frontend/pages/Home.jsx`:
   - Import all 5 components and all 4 API functions
   - On form submit: call all 4 API functions in sequence, storing each result in state
   - Render each card section only when its data is available (conditional rendering)
   - Show a loading indicator while any call is in progress
   - Show an error message if any call fails
2. Refactor `frontend/src/App.jsx` — remove all inline logic; import and render `<Home />` only
3. Move any missing component imports in `main.jsx` or `App.jsx` as needed

**Relevant Context:**
- `frontend/src/App.jsx` — current monolithic implementation to be replaced
- `frontend/pages/Home.jsx` — currently empty
- `frontend/services/api.js` — completed in Sub-Task 5
- All 5 components — completed in Sub-Task 6
- Sequential API flow: `creativeBrief` → `script` (uses brief) → `storyboard` (uses script + brief) → `mentor` (uses all three)

**Status:** [ ] pending

---

## Implementation Order

```
Sub-Task 1  →  Sub-Task 2  →  Sub-Task 3  →  Sub-Task 4
   (config)      (prompts)     (services)   (controllers/routes/server)

Sub-Task 5  →  Sub-Task 6  →  Sub-Task 7
  (api.js)    (components)   (Home + App)
```

Backend (1–4) and Frontend (5–7) are independent tracks after Sub-Task 1. Backend must be complete before Sub-Task 7 can be end-to-end tested.
