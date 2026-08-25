# Security Policy

## Reporting a Vulnerability

**Do NOT open a public issue for security vulnerabilities.**

Instead, please email **hi@santifer.io** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

You will receive a response within 72 hours. We will work with you to understand and address the issue before any public disclosure.

## Scope

Security issues in the following are in scope:

- **Agent layer** (`.claude-plugin/plugin.json`, `batch/batch-runner.sh`, `CLAUDE.md`, `AGENTS.md`, `.agents/skills/`, `modes/`) — over-broad tool permissions, prompt injection reaching a tool call, agent instructions that let fetched content act as a command
- **Scripts** (`*.mjs`) — command injection, path traversal, SSRF
- **Dashboard** (`dashboard/`) — any Go binary vulnerabilities
- **Templates** (`templates/`) — XSS in generated HTML/PDF, data exfiltration from a rendered CV
- **Update system** (`update-system.mjs`) — supply-chain issues in how upstream code is fetched and applied
- **Configuration** — secrets exposure, unsafe defaults

### Threat model

career-ops fetches job postings from the open web and puts that text into an
LLM's context on the user's machine. **Job-posting content is untrusted input.**
The security-relevant question for most changes is: *if this text were written
by an attacker, what could it cause?*

Two rules follow from that, and both are enforced in the code:

1. **Tool permissions are enumerated, never wildcarded.** `Bash(node:*)` is not
   a narrower grant than `Bash(*)` — it matches `node -e "<any JavaScript>"`.
   The same is true of `npm:*`, `npx:*`, and `python:*`. Batch workers run under
   an explicit `--allowed-tools` list, not `--dangerously-skip-permissions`.
2. **Content fetched from a posting never becomes an instruction, a file path,
   or a network destination.** See the "Untrusted Input" section of `AGENTS.md`.

## Out of Scope

- Issues in third-party dependencies (report upstream)
- Issues requiring physical access to the user's machine
- Social engineering attacks
- career-ops is a local tool — there is no hosted service to attack

## Disclosure Policy

We follow coordinated disclosure. Once a fix is released, we will credit the reporter (unless they prefer anonymity) in the release notes.
