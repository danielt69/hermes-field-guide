## MCP and plugins

### MCP: native in both directions

Hermes acts as an MCP **client**, connecting to external tool servers over stdio or HTTP. It can also act as an MCP **server**, exposing its messaging conversations to other agents ([MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)).

Start from a single concrete need, such as GitHub, a database or a filesystem boundary. Do not start from a wish list.

### Worked path: catalog server, then test, then filter

1. List the Nous-reviewed catalog. Entries are disabled by default.

   ```bash
   hermes mcp catalog
   ```

2. Read the entry's manifest before installing. Installing runs its source, bootstrap commands and server code. The trust model is review at admission into the repo, which the docs say does not replace your own reading.
3. Install the entry. The docs use `deepwiki` as their example:

   ```bash
   hermes mcp install deepwiki
   ```

4. Test the connection, then narrow down which of its tools Hermes exposes:

   ```bash
   hermes mcp test deepwiki
   hermes mcp configure deepwiki     # toggle individual tools
   ```

5. Start a new session, or run `/reload-mcp`, and try a read-only request first.

For a custom server, `hermes mcp add <name> --command npx --args ...` works for stdio servers (`--args` must come last), or `--url` for HTTP servers. Filter in config so the model only sees what it needs:

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PERSONAL_ACCESS_TOKEN}"
    tools:
      include: [list_issues, create_issue]
      prompts: false
      resources: false
```

Stdio servers receive only the `env` you configure plus a safe baseline, never your whole shell environment. If many servers bloat the context, **Tool Search** is an opt-in layer that loads tool schemas on demand ([Tool Search](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-search)).

To use Hermes as a server for another client:

```bash
hermes mcp serve
```

### Plugins

Plugins add tools, hooks, memory providers or context engines. **Third-party plugins are disabled by default** and load only once they are named in `plugins.enabled` ([Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)).

```bash
hermes plugins search <term>
hermes plugins install <catalog-name>   # resolves to a reviewed, pinned commit
hermes plugins list
hermes plugins enable <name>            # explicit consent step
```

The docs state plainly that being in the catalog does not mean the code has been audited. Installs are statically scanned: a `dangerous` verdict is blocked even with `--force`. Installing from a raw Git URL or `owner/repo` is flagged as unreviewed.

### Security checklist

- Keep one server per concrete need, filtered to the smallest set of tools.
- Test the read-only path before allowing any writes.
- Keep secrets in `.env` and reference them with `${VAR}`.
- Run `hermes security audit` periodically. It checks dependencies against OSV, including pinned MCP servers.

Before building your own toolchain on top of this, see [Build your J.A.R.V.I.S.](#/jarvis).

### Sources

- [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [MCP config reference](https://hermes-agent.nousresearch.com/docs/reference/mcp-config-reference)
- [Use MCP with Hermes](https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes)
- [Tool Search](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-search)
- [Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
- [Plugin catalog](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugin-catalog)
- [CLI commands reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
