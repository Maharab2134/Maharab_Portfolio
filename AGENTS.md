## Git Workflow Rules

### 1. Complete the Work First
- Finish the assigned task completely before creating a commit.
- Make sure all requested functionality, UI changes, fixes, and related files are properly implemented.
- Do not leave incomplete or temporary code unless explicitly required.

### 2. Review Before Commit
After completing the task, perform a full self-review:
- Review all changed files.
- Check for bugs, regressions, unused imports, unused variables, console logs, debug code, and unnecessary changes.
- Verify TypeScript/ESLint/build/test status where applicable.
- Check that the implementation follows the project's existing architecture, coding conventions, and documentation rules.
- Review the final diff using Git before committing.

### 3. Test Before Commit
- Run the relevant tests and validation commands.
- If the project has linting, type-checking, unit tests, or build commands, run the appropriate ones.
- Fix any issues found during validation before committing.
- Do not commit known broken code unless explicitly instructed.

### 4. Commit Automatically After Review
Once the work has been completed, reviewed, and validated:
- Create a Git commit automatically.
- Use a clear, concise, professional commit message following the project's existing commit convention.
- The commit should contain only changes related to the assigned task.
- Do not include unrelated modifications.

### 5. NEVER Push Automatically
**IMPORTANT: Do NOT run `git push` automatically.**

After creating the commit:
- Keep the commit locally.
- Do not push to `origin`, GitHub, GitLab, or any remote repository.
- Do not create or update a Pull Request.
- Do not merge any branch.
- Do not force-push.
- Wait for explicit user approval.

Only push when the user clearly instructs you to do so, such as:
- "Push it"
- "Push the commit"
- "Push to GitHub"
- "Create PR and push"

### 6. Final Response After Commit
After completing and committing the work, report:
- What was changed
- What was reviewed
- Tests/checks performed
- Commit hash
- Commit message
- Clearly state that the changes are **committed locally but NOT pushed**

Example:

"Task completed and reviewed successfully.
- Tests: passed
- Build: passed
- Commit: `abc1234`
- Message: `feat: update workforce page`
- Push: Not performed — waiting for your approval."

### 7. User Controls Remote Changes
The user must always have final control over remote repository changes.

**Default workflow:**
`Implement → Review → Test → Commit → STOP`

**Never:**
`Implement → Review → Test → Commit → Push`

Push is always a separate action requiring explicit user approval.

---

## Database & Data Integrity Rules

### 1. Zero Unintended Data Loss (Never Wipe or Purge Data)
- Under NO circumstances should any database table (`profile_info`, `education`, `experience`, `projects`, `skills`, `certificates`, `messages`, `testimonials`, etc.) be truncated, wiped, or cleared.
- NEVER run destructive queries (such as `TRUNCATE`, `DROP TABLE`, or unconditional `DELETE FROM <table>;`) without explicit user permission.
- Simple bug fixes or UI updates must NEVER delete, reset, or purge records inserted or updated by the user in the database or admin studio.

### 2. Non-Destructive Updates & Field Merging
- When saving or updating records, NEVER overwrite user-customized fields with hardcoded defaults.
- Always perform non-destructive merges: merge incoming changes with existing database/cached values (`prev => ({ ...prev, ...incoming })`) so that untouched fields retain their customized data.
- Never pass `null` or empty strings to overwrite existing values unless the user explicitly cleared that field.

### 3. Safe Fallback Handling (Never Discard User Fields on Schema Error)
- If PostgREST or Supabase returns a schema cache or column error, NEVER fallback by dropping all user fields and saving bare defaults.
- Handle column errors adaptively by removing only the specific missing column from the query, while preserving all other user-entered data intact.
- Inform the user of any required database schema migration rather than quietly erasing their input.

### 4. Non-Destructive Database Migrations
- Schema updates must ALWAYS be additive and backward-compatible: use `ADD COLUMN IF NOT EXISTS`, safe defaults, and non-breaking constraints.
- NEVER run `DROP COLUMN`, drop tables, or re-run initial `CREATE TABLE` scripts that overwrite live tables with seed data.
- Ensure all existing rows in production preserve their data when new columns are introduced.

### 5. Cache & Refresh Protection (Prevent Revert to Defaults)
- When fetching data on page load or refresh, `null` or undefined columns from the database must NEVER wipe out valid user data in local storage or state.
- Always retrieve the newest record (`.order("updated_at", { ascending: false }).limit(1)`) so older rows never overwrite fresh updates.
- Synchronous cache initializers must always be used in admin forms to prevent a flash of default values or accidental overwrite on initial render.

### 6. Soft Toggles Over Hard Deletion
- For sections and items (such as Education, Certificates, Experience, Projects), prefer soft toggles (`is_active: false`) instead of hard deletion (`DELETE FROM <table>`).
- When a user deactivates or hides an item, the underlying data must remain safely stored in the database so it can be restored at any time.