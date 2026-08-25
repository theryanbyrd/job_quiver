package data

import (
	"os"
	"path/filepath"
	"testing"
)

// Report links and job URLs both originate in files the agent writes from
// untrusted job-posting content, so these two helpers are the containment
// boundary for the dashboard.

func TestSafeJoinRejectsTraversal(t *testing.T) {
	base := t.TempDir()

	cases := []struct {
		name string
		rel  string
		want bool
	}{
		{"plain report", "reports/001-acme-2026-01-01.md", true},
		{"nested report", "reports/sub/002.md", true},
		{"dot-slash prefix", "./reports/003.md", true},
		{"parent escape", "../secret.md", false},
		{"deep escape", "../../../../etc/passwd", false},
		{"absolute path", "/etc/passwd", false},
		// Traverses out and back in — the resolved path is still contained,
		// so this is allowed. Containment is judged on the result, not on
		// whether ".." appears in the input.
		{"escape then return", "../" + filepath.Base(base) + "/ok.md", true},
		{"empty", "", false},
		{"bare parent", "..", false},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got, ok := SafeJoin(base, tc.rel)
			if ok != tc.want {
				t.Fatalf("SafeJoin(%q, %q) ok = %v, want %v (path %q)", base, tc.rel, ok, tc.want, got)
			}
			if ok {
				rel, err := filepath.Rel(base, got)
				if err != nil || rel == ".." || filepath.IsAbs(rel) {
					t.Fatalf("SafeJoin returned %q which is not contained in %q", got, base)
				}
			}
		})
	}
}

// End-to-end: a traversing report link in applications.md must not cause the
// referenced file to be read.
func TestParseApplicationsIgnoresTraversingReportLink(t *testing.T) {
	root := t.TempDir()
	dataDir := filepath.Join(root, "data")
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		t.Fatal(err)
	}

	secret := filepath.Join(root, "SECRET.md")
	if err := os.WriteFile(secret, []byte("**URL:** https://leaked.example/secret\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	tracker := "| # | Date | Company | Role | Score | Status | PDF | Report |\n" +
		"|---|---|---|---|---|---|---|---|\n" +
		"| 1 | 2026-01-01 | EvilCo | Engineer | 4.0/5 | Evaluated | ✅ | [1](../SECRET.md) |\n"
	if err := os.WriteFile(filepath.Join(dataDir, "applications.md"), []byte(tracker), 0o600); err != nil {
		t.Fatal(err)
	}

	apps := ParseApplications(dataDir)
	if len(apps) != 1 {
		t.Fatalf("expected 1 application, got %d", len(apps))
	}
	if apps[0].JobURL == "https://leaked.example/secret" {
		t.Fatal("traversing report link was followed: content outside the base dir was read")
	}
}

func TestSafeExternalURL(t *testing.T) {
	cases := []struct {
		raw  string
		want bool
	}{
		{"https://jobs.lever.co/acme/123", true},
		{"http://boards.greenhouse.io/x", true},
		{"httpfoo://evil.example/x", false},
		{"file:///etc/passwd", false},
		{"javascript:alert(1)", false},
		{"smb://attacker.example/share", false},
		{"-a/Applications/Calculator.app", false},
		{"--version", false},
		{"", false},
		{"https://", false},
		{"not a url at all", false},
	}

	for _, tc := range cases {
		got, ok := SafeExternalURL(tc.raw)
		if ok != tc.want {
			t.Errorf("SafeExternalURL(%q) ok = %v, want %v (got %q)", tc.raw, ok, tc.want, got)
		}
	}
}
