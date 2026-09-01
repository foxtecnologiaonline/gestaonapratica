import fs from "node:fs";
import path from "node:path";
import {
  commitPostFile,
  deletePostFile,
  isGithubPublishingConfigured,
} from "@/lib/github-content";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type WriteResult =
  | { ok: true; viaGithub: boolean }
  | { ok: false; error: string };

/**
 * Publica (cria ou atualiza) um post. Se a publicação via GitHub estiver
 * configurada, grava lá (persiste em produção). Caso contrário, grava no
 * filesystem local — só funciona em desenvolvimento (`npm run dev`), já que
 * hospedagens serverless têm filesystem somente leitura em produção.
 */
export async function publishPost(
  filename: string,
  content: string,
  commitMessage: string,
): Promise<WriteResult> {
  if (isGithubPublishingConfigured()) {
    const result = await commitPostFile(filename, content, commitMessage);
    return result.ok ? { ok: true, viaGithub: true } : result;
  }

  if (process.env.NODE_ENV === "production") {
    return {
      ok: false,
      error:
        "Publicação via GitHub não configurada e o filesystem em produção não é persistente. Defina GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO.",
    };
  }

  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(POSTS_DIR, filename), content, "utf-8");
  return { ok: true, viaGithub: false };
}

export async function unpublishPost(
  filename: string,
  commitMessage: string,
): Promise<WriteResult> {
  if (isGithubPublishingConfigured()) {
    const result = await deletePostFile(filename, commitMessage);
    return result.ok ? { ok: true, viaGithub: true } : result;
  }

  if (process.env.NODE_ENV === "production") {
    return { ok: false, error: "Publicação via GitHub não configurada." };
  }

  const filePath = path.join(POSTS_DIR, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return { ok: true, viaGithub: false };
}
