type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

type GithubResult = { ok: true } | { ok: false; error: string };

function getGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

export function isGithubPublishingConfigured(): boolean {
  return getGithubConfig() !== null;
}

async function githubRequest(
  path: string,
  config: GithubConfig,
  init?: RequestInit,
) {
  return fetch(`https://api.github.com/repos/${config.owner}/${config.repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
}

/**
 * Cria ou atualiza um arquivo de post via GitHub Contents API. Cada chamada
 * gera um commit direto na branch configurada — é assim que a publicação
 * persiste em produção (serverless não grava em disco de forma durável).
 */
export async function commitPostFile(
  filename: string,
  content: string,
  message: string,
): Promise<GithubResult> {
  const config = getGithubConfig();
  if (!config) {
    return {
      ok: false,
      error:
        "Publicação via GitHub não configurada (defina GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO).",
    };
  }

  const path = `content/posts/${filename}`;
  let sha: string | undefined;

  const existing = await githubRequest(`/contents/${path}?ref=${config.branch}`, config);
  if (existing.status === 200) {
    const data = await existing.json();
    sha = data.sha;
  }

  const response = await githubRequest(`/contents/${path}`, config, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return {
      ok: false,
      error: err.message || `Erro ao publicar no GitHub (status ${response.status}).`,
    };
  }

  return { ok: true };
}

export async function deletePostFile(
  filename: string,
  message: string,
): Promise<GithubResult> {
  const config = getGithubConfig();
  if (!config) {
    return { ok: false, error: "Publicação via GitHub não configurada." };
  }

  const path = `content/posts/${filename}`;
  const existing = await githubRequest(`/contents/${path}?ref=${config.branch}`, config);
  if (existing.status !== 200) {
    return { ok: false, error: "Post não encontrado no repositório." };
  }
  const data = await existing.json();

  const response = await githubRequest(`/contents/${path}`, config, {
    method: "DELETE",
    body: JSON.stringify({ message, sha: data.sha, branch: config.branch }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return {
      ok: false,
      error: err.message || `Erro ao excluir no GitHub (status ${response.status}).`,
    };
  }

  return { ok: true };
}
